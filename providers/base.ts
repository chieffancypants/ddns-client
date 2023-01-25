export interface Headers {
    [key: string]: string
}

export interface DNSRecords {

}

export abstract class BaseProvider {
    endpoint: string

    constructor (endpoint:string) {
        this.endpoint = endpoint
    }

    abstract get (resource:string): Promise<any>

}
