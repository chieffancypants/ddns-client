import * as dotenv from 'dotenv';

dotenv.config()
const ENDPOINT = 'https://porkbun.com/api/json/v3';

const get = (action, data) => {
    return fetch(`${ENDPOINT}/${action}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({
            apikey: process.env.API_KEY,
            secretapikey: process.env.API_SECRET,
            ...data
        })
    }).then(r => {
        if (!r.ok) throw new Error(`Failed to get ${action}`)
        return r.json()
    }).catch(e => {
        console.log(e)
        throw new Error(`Error with API call: ${action}`, e)
    })
}

// if (!ipRes.ok) throw new Error('Failed to get IP address')
// const ip = await ipRes.json().yourIp
const [{yourIp:ip}, dnsRecords] = await Promise.all([
    get('ping'),
    get(`dns/retrieveByNameType/${process.env.DOMAIN}/a/${process.env.HOSTNAME}`)
]);

// create the record if it doesn't exist
if (dnsRecords.records.length === 0) {
    const created = await get(`dns/create/${process.env.DOMAIN}`, {name: process.env.HOSTNAME, type: 'A', content: ip, ttl: 300})
    console.log(created)
} else {
    // update the record if it does
    const updated = await get(`dns/editByNameType/${process.env.DOMAIN}/a/${process.env.HOSTNAME}`, { content: ip })
    console.log(updated)
}