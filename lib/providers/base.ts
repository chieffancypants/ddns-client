import type { APIError } from '../errors'

export interface Headers {
    [key: string]: string
}

export interface DNSRecord {
    id: number,
    name: string,
    type: string, // A, AAAA, CNAME, MX, TXT, SRV, NS
    ip: string,
    ttl: number,
}

export abstract class BaseProvider {
    endpoint: string
    domain: string
    hostname: string

    constructor (endpoint:string, domain:string, hostname:string) {
        this.endpoint = endpoint
        this.domain = domain
        this.hostname = hostname
    }

    headersToObject (res: Response) {
        const headers = res.headers
        const headersObject: { [key: string]: string } = {}
        headers.forEach((value, key) => {
            headersObject[key] = value
        })
        return headersObject
    }

    abstract getRecords (resource:string): Promise<DNSRecord[]>
    abstract updateRecord (resource:string, ip:string): Promise<any> | APIError
    abstract createRecord (resource:string, ip:string): Promise<any> | APIError

}
