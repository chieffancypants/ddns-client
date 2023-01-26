import * as dotenv from 'dotenv'

import getIP from './ip'
import { Porkbun } from './providers/porkbun'

dotenv.config()

const envVariables = [
    'DOMAIN',
    'HOSTNAME',
    'API_KEY',
    'API_SECRET',
    'PROVIDER'
]


;(async function main () {
    const env = process.env
    envVariables.forEach(v => {
        if (!env[v]) throw new Error(`Missing environment variable: ${v}`)
    })

    let provider
    if (env.PROVIDER!.toLowerCase() === 'porkbun') {
        provider = new Porkbun(env.DOMAIN!, env.HOSTNAME!)
    } else {
        throw new Error('Invalid provider specified')
    }

    // Get IP address and DNS records
    const [ip, dnsRecords] = await Promise.all([
        getIP(),
        provider.getRecords(env.HOSTNAME!)
    ])

    // if record doesn't exist, create it:
    if (dnsRecords.length === 0) {
        const created = await provider.createRecord(env.HOSTNAME!, ip)
        console.log(`Created "A" record for "${env.HOSTNAME}" at ${ip}`)
        return
    }

    // find the first matching hostname, though very unlikely length is > 1
    const record = dnsRecords.find(r => r.name === env.HOSTNAME)
    if (!record) throw new Error('Could not find hostname in returned DNS records')

    // if the IP address is the same, do nothing
    if (record.ip === ip) {
        console.log('IP address is the same, no update needed')
        return
    }

    // update the record:
    const updated = await provider.updateRecord(env.HOSTNAME!, ip)
    console.log('updated record: ', updated)

})()

// if (!ipRes.ok) throw new Error('Failed to get IP address')
// const ip = await ipRes.json().yourIp


// create the record if it doesn't exist
// if (dnsRecords.records.length === 0) {
//     const created = await get(`dns/create/${process.env.DOMAIN}`, {name: process.env.HOSTNAME, type: 'A', content: ip, ttl: 300})
//     console.log(created)
// } else {
//     // update the record if it does
//     const updated = await get(`dns/editByNameType/${process.env.DOMAIN}/a/${process.env.HOSTNAME}`, { content: ip })
//     console.log(updated)
// }
