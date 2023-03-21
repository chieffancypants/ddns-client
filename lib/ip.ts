import { APIError } from './errors'
import log from './log'

let ip = ''

interface IpifyResponse {
    ip: string;
}

export default async function getIP () {
    log.info('Getting IP address...')
    if (ip) return Promise.resolve(ip)

    let resp
    try {
        resp = await fetch('https://api.ipify.org?format=json')
            .then((r: Response) => r.json())
            .then((r: IpifyResponse) => {
                ip = r.ip
                return ip
            })
    } catch (cause) {
        throw new APIError('Could not get IP address', { cause })
    }

    return resp

}
