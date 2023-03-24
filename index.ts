import * as dotenv from 'dotenv'

import getIP from './lib/ip'
import log from './lib/log'
import { Porkbun } from './lib/providers/porkbun'
import { ProgramError } from './lib/errors'

dotenv.config()
log.level = process.env.LOG_LEVEL || 'info'
const envVariables = [
    'DOMAIN',
    'HOSTNAME',
    'API_KEY',
    'API_SECRET',
    'PROVIDER'
]

async function main () {
    log.info('Starting DDNS client...')

    const env = process.env
    envVariables.forEach(v => {
        if (!env[v]) throw new ProgramError(`Missing environment variable: ${v}`)
    })

    let provider
    if (env.PROVIDER!.toLowerCase() === 'porkbun') {
        provider = new Porkbun({
            domain: env.DOMAIN!,
            apiKey: env.API_KEY!,
            apiSecret: env.API_SECRET!
        })
    } else {
        throw new ProgramError('Invalid provider specified')
    }

    // Get IP address and DNS records
    const [ip, dnsRecords] = await Promise.all([
        getIP(),
        provider.getRecords(env.HOSTNAME!)
    ])

    log.debug({ip, dnsRecords}, 'Recieved IP address and A record')

    // if record doesn't exist, create it:
    if (dnsRecords.length === 0) {
        log.debug('DNS A record doesn\'t exist.  Creating one now...')
        await provider.createRecord(env.HOSTNAME!, ip)
        log.info(`Created "A" record for "${env.HOSTNAME}" at ${ip}`)
        return
    }

    // find the first matching hostname, though very unlikely length is > 1
    const record = dnsRecords.find(r => r.name === env.HOSTNAME)
    if (!record) throw new ProgramError('Could not find hostname in returned DNS records')

    // if the IP address is the same, do nothing
    if (record.ip === ip) {
        log.info(`IP address is the same (${ip}), no update needed`)
        return
    }

    // update the record:
    log.debug('IP address changed since last check.  Updating...')
    await provider.updateRecord(env.HOSTNAME!, ip)
    log.info({ current:ip, previous: record.ip,  }, 'Updated A record to latest IP address')
}

// Catch any errors thrown and log them:
main().then(() => {
    log.debug('DDNS client completed successfully')
}).catch(e => {
    log.fatal(e)
    throw e
})
