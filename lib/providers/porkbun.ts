import { BaseProvider } from './base'
import { HTTPError } from '../errors'

import type { DNSRecord, Headers, ProviderOpts } from './base'

const ENDPOINT = 'https://porkbun.com/api/json/v3'

type DNSRecordUpdateResponse = {
    status: 'SUCCESS' | 'ERROR',
}

/**
 * Create DDNS `A` record using Porkbun's API. They have a super weird API because for some reason
 * they require authentication params be POSTed in the body instead of as a header. So even if
 * you're just retrieving data, you need to use the POST http method. I don't know why they did
 * this, because it ruins the purpose of using semantic HTTP methods (GET, POST, PUT, DELETE, etc)
 */
export class Porkbun extends BaseProvider {
    headers: Headers

    constructor (opts:Omit<ProviderOpts, 'endpoint'>) {
        super({ endpoint: ENDPOINT, ...opts })
        this.headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        }
    }

    async getRecords (aRecord:string): Promise<DNSRecord[]> {
        const recs = await this.get(`dns/retrieveByNameType/${this.domain}/a/${aRecord}`)
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
        return this.post(url, body)
    }

    async updateRecord (aRecord:string, ip:string): Promise<DNSRecordUpdateResponse> {
        const url = `dns/editByNameType/${this.domain}/a/${aRecord}`
        const body = { content: ip }
        return await this.post(url, body)
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
                apikey: this.apiKey,
                secretapikey: this.apiSecret,
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
