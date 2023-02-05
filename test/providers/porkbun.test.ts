import { describe, expect, it, jest } from '@jest/globals'

import { HTTPError } from '../../lib/errors'
import { Porkbun } from '../../lib/providers/porkbun'

// jest.mock('dotenv', () => ({ config: jest.fn() }), { virtual: true })
jest.mock('../../lib/log')

describe('Porkbun Provider', () => {
    const porkbun = new Porkbun({ domain: 'example.com', apiKey: '12345', apiSecret: '67890' })
    const success = (resp: any) => Promise.resolve({
        json: () => Promise.resolve(resp),
        ok: true
    }) as Promise<Response>

    const errorResponse = (err: any, msg = `Error ${err}`) => Promise.resolve({
        text: () => Promise.resolve(err),
        ok: false,
        status: err,
        statusText: msg
    }) as Promise<Response>

    describe('Authentication', () => {
        it('should POST auth data to the correct endpoint', async () => {
            const successResp = {
                status: 'SUCCESS',
                records: []
            }
            const fetchMock = jest.spyOn(global, 'fetch').mockImplementation(() => success(successResp))
            await porkbun.getRecords('testRecord')
            const body = JSON.parse(fetchMock.mock.calls[0][1]?.body as string)
            expect(body.apikey).toBe('12345')
            expect(body.secretapikey).toBe('67890')
        })
    })

    describe('getRecords()', () => {
        const successResp = {
            status: 'SUCCESS',
            records: [{
                id: 123456,
                name: 'testRecord.example.com',
                type: 'A',
                content: '127.0.0.1',
                ttl: 600,
            }]
        }

        it('should use POST even for GET requests', async () => {
            const fetchMock = jest.spyOn(global, 'fetch').mockImplementation(() => success(successResp))
            const t = await porkbun.getRecords('testRecord')
            expect(fetchMock.mock.calls[0][1]?.method).toBe('POST')
        })

        it('should call the correct endpoint', async () => {
            const fetchMock = jest.spyOn(global, 'fetch').mockImplementation(() => success(successResp))
            const t = await porkbun.getRecords('testRecord')
            expect(fetchMock.mock.calls[0][0]).toBe('https://porkbun.com/api/json/v3/dns/retrieveByNameType/example.com/a/testRecord')
        })

        it('should rename the "content" field to "ip"', async () => {
            jest.spyOn(global, 'fetch').mockImplementation(() => success(successResp))
            const t = await porkbun.getRecords('testRecord')
            expect(t[0].ip).toEqual(successResp.records[0].content)
        })

        it('should throw 500 server errors', async () => {
            jest.spyOn(global, 'fetch').mockImplementation(() => errorResponse(500, 'Internal Server Error'))

            try {
                const t = await porkbun.getRecords('testRecord')
            } catch (e) {
                expect(e).toBeInstanceOf(HTTPError)
                expect((e as HTTPError).message).toBe('HTTP Error Status')
            }
        })

        it('should handle 404 server errors', async () => {
            jest.spyOn(global, 'fetch').mockImplementation(() => errorResponse(404))

            try {
                const t = await porkbun.getRecords('testRecord')
            } catch (e) {
                expect(e).toBeInstanceOf(HTTPError)
                expect((e as HTTPError).message).toBe('HTTP Error Status')
            }
        })
    })

    describe('createRecord()', () => {
        const successResp = {
            status: 'SUCCESS',
            message: 'Record created'
        }

        it('should call the correct endpoint', async () => {
            const fetchMock = jest.spyOn(global, 'fetch').mockImplementation(() => success(successResp))
            const t = await porkbun.createRecord('testRecord', '127.0.0.1')
            expect(fetchMock.mock.calls[0][0]).toBe('https://porkbun.com/api/json/v3/dns/create/example.com')
        })

        it('should handle server errors with context', async () => {
            jest.spyOn(global, 'fetch').mockImplementation(() => errorResponse(500))

            try {
                const t = await porkbun.createRecord('testRecord', '127.0.0.1')
            } catch (e) {
                expect(e).toBeInstanceOf(HTTPError)
                expect((e as HTTPError).message).toBe('HTTP Error Status')
                expect((e as HTTPError).context?.statusCode).toEqual(500)
            }
        })
    })

    describe('updateRecord()', () => {
        const successResp = {
            status: 'SUCCESS',
            message: 'Record updated'
        }

        it('should call the correct endpoint', async () => {
            const fetchMock = jest.spyOn(global, 'fetch').mockImplementation(() => success(successResp))
            const t = await porkbun.updateRecord('testRecord', '127.0.0.1')
            expect(fetchMock.mock.calls[0][0]).toBe('https://porkbun.com/api/json/v3/dns/editByNameType/example.com/a/testRecord')
            const body = JSON.parse(fetchMock.mock.calls[0][1]?.body as string)
            expect(body.content).toEqual('127.0.0.1')
        })
    })
})
