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
        provider.getARecord(env.HOSTNAME!)
    ])

    console.log(ip, dnsRecords)

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
