import path from 'path'
import pino from 'pino'

import { APIError, HTTPError } from './errors'

/**
 * The destination works when running the TS directly (ts-node), and also as a packaged app.
 * - When running through ts-node, `__dirname` is `/somepath/dns-client/lib`
 * - When compiled with ncc, the files in `lib` are concatinated then placed in `.../dns-client/build`
 * This makes it simple to log to the root directory regardless of how the app is run by removing
 * the last directory from the path
 */
const p = __dirname.substring(0, __dirname.lastIndexOf('/'))
const destination = path.resolve(`${p}/ddns-client.log`)

const logger = pino({
    transport: {
        targets: [{
            target: 'pino/file',
            level: process.env.LOG_LEVEL || 'info',
            options: { destination: destination }
        }]
    },
    serializers: {
        err: pino.stdSerializers.wrapErrorSerializer((e) => {
            // loop through all each Error cause and build up the `context` property for each
            const cause = e.raw.cause
            const context:{ [key: string]: any } = {}

            if (cause !== null && typeof cause === 'object') {
                if (cause instanceof HTTPError || cause instanceof APIError) {
                    const type = toString.call(cause.constructor) === '[object Function]'
                        ? cause.constructor.name
                        : cause.name
                    context[type] = cause.context
                }
            }

            return {
                type: e.type,
                message: e.message,
                stack: e.stack,
                contexts: context
            }
        })
    }
})

export default logger
