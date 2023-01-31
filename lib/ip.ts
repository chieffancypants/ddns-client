import { APIError } from './errors'
import log from './log'

let ip = ''

export default async function getIP () {
    log.info('Getting IP address...')
    if (ip) return Promise.resolve(ip)

    let resp
    try {
        resp = await fetch('https://api.ipify.org?format=json')
            .then(r => r.json())
            .then(r => {
                ip = r.ip
                return ip
            })
    } catch (e) {
        throw new APIError('Could not get IP address', e)
    }

    return resp

}
