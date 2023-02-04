import * as dotenv from 'dotenv'

import getIP from './lib/ip'
import log from './lib/log'
import { Porkbun } from './lib/providers/porkbun'
import { ProgramError } from './lib/errors'

dotenv.config()

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
        provider = new Porkbun(env.DOMAIN!, env.HOSTNAME!)
    } else {
        throw new ProgramError('Invalid provider specified')
    }

    // Get IP address and DNS records
    const [ip, dnsRecords] = await Promise.all([
        getIP(),
        provider.getRecords(env.HOSTNAME!)
    ])

    // if record doesn't exist, create it:
    if (dnsRecords.length === 0) {
        await provider.createRecord(env.HOSTNAME!, ip)
        log.info(`Created "A" record for "${env.HOSTNAME}" at ${ip}`)
        return
    }

    // find the first matching hostname, though very unlikely length is > 1
    const record = dnsRecords.find(r => r.name === env.HOSTNAME)
    if (!record) throw new ProgramError('Could not find hostname in returned DNS records')

    // if the IP address is the same, do nothing
    if (record.ip === ip) {
        log.info('IP address is the same, no update needed')
        return
    }

    // update the record:
    await provider.updateRecord(env.HOSTNAME!, ip)
    log.info(`Updated record from ${record.ip} to ${ip}`)

}

// Catch any errors thrown and log:
main().catch(e => {
    log.error(e)
    throw e
})
