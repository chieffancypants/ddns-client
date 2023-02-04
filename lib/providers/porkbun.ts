import * as dotenv from 'dotenv'

import { APIError, HTTPError } from '../errors'
import { BaseProvider } from './base'

import type { DNSRecord, Headers } from './base'

const ENDPOINT = 'https://porkbun.com/api/json/v3'
dotenv.config()


/**
 * Create DDNS `A` record using Porkbun's API. They have a super weird API because for some reason
 * they require authentication params be POSTed in the body instead of as a header. So even if
 * you're just retrieving data, you need to use the POST http method. I don't know why they did
 * this, because it ruins the purpose of using semantic HTTP methods (GET, POST, PUT, DELETE, etc)
 */
export class Porkbun extends BaseProvider {
    headers: Headers

    constructor (domain: string, hostname: string) {
        super(ENDPOINT, domain, hostname)
        this.headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        }
    }

    async getRecords (aRecord:string): Promise<DNSRecord[]> {
        let recs

        // const recs = await this.get(`dns/retrieveByNameType/${this.domain}/a/${aRecord}`)
        try {
            recs = await this.get(`dns/retrieveByNameType/${this.domain}/a/${aRecord}`)
        } catch (cause) {
            throw new APIError('Could not retrieve DNS records', { cause, context: recs })
        }

        return recs.records.map((r:any) => ({
            id: r.id,
            name: r.name.split('.')[0],
            type: r.type,
            ip: r.content,
            ttl: r.ttl
        }))
    }

    async createRecord (aRecord:string, ip:string) {
        const url = `dns/create/${this.domain}`
        const body = {
            name: aRecord,
            type: 'A',
            content: ip,
            ttl: 600
        }
        const res = await this.post(url, body)
        if (res.status !== 'SUCCESS') {
            const apiMessage = {
                apiResponse: res.message,
                record: aRecord,
                domain: this.domain,
                url,
                body,
            }
            throw new APIError(`Could not create A record "${aRecord}" on host "${this.domain}`, { context: apiMessage })
        }
        return res
    }

    async updateRecord (aRecord:string, ip:string) {
        const url = `dns/editByNameType/${this.domain}/a/${aRecord}`
        const body = { content: ip }
        const res = await this.post(url, body)
        if (res.status !== 'SUCCESS') {
            const apiMessage = {
                apiResponse: res.message,
                record: aRecord,
                domain: this.domain,
                url,
                body
            }
            throw new APIError(`Could not update A record "${aRecord}" on host "${this.domain}`, { context: apiMessage })
        }
        return res
    }

    get (resource:string) {
        return this.callApi(resource)
    }

    post (resource:string, data:object) {
        return this.callApi(resource, data)
    }

    private async callApi (action:string, data?:object): Promise<any> {
        const postData = {
            method: 'POST',
            headers: this.headers,
            body: JSON.stringify({
                apikey: process.env.API_KEY,
                secretapikey: process.env.API_SECRET,
                ...data
            })
        }

        return await fetch(`${this.endpoint}/${action}`, postData)
            .then(async r => {
                if (!r.ok) {
                    const context = {
                        url: r.url,
                        statusCode: r.status,
                        statusMessage: r.statusText,
                        responseHeaders: this.headersToObject(r),
                        body: await r.text()
                    }
                    throw new HTTPError('HTTP Error Status', { context })
                }
                return r
            })
            .then(r => r.json())

    }
}
