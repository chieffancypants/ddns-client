import * as dotenv from 'dotenv'

import { BaseProvider } from './base'

import type { Headers } from './base'

dotenv.config()

const ENDPOINT = 'https://porkbun.com/api/json/v3'


/**
 * Create DDNS using Porkbun's API. This is a super weird API because for some reason they require
 * you POST authentication params to the endpoint for every request, even if you're just `GET`ting
 * data. I don't know why they did this, because it violates the principle of HTTP methods
 */


// write a docstring description for this function:
export class Porkbun extends BaseProvider {
    headers: Headers
    domain: string
    hostname: string

    constructor (domain: string, hostname: string) {
        super(ENDPOINT)
        this.domain = domain
        this.hostname = hostname
        this.headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        }
    }

    getARecord (aRecord:string) {
        this.get(`dns/retrieveByNameType/${this.domain}/a/${aRecord}`)
    }

    get (resource:string): Promise<any> {
        return this.callApi(resource)
    }

    post (resource:string, data:object) {
        return this.callApi(resource, data)
    }

    private callApi (action:string, data?:object): Promise<any> {
        return fetch(`${ENDPOINT}/${action}`, {
            method: 'POST',
            headers: this.headers,
            body: JSON.stringify({
                apikey: process.env.API_KEY,
                secretapikey: process.env.API_SECRET,
                ...data
            })
        }).then(r => {
            console.log(r)
            if (!r.ok) throw new Error(`Failed to get ${action}`)
            return r.json()
        }).catch(e => {
            throw new Error(`Error with API call (${action}): ${e.message}`)
        })
    }
}
