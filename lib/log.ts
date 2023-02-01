import pino from 'pino'

/**
 * The destination works when running the app directly (ts-node), and also as a packaged app.
 * - When running through ts-node, `__dirname` is `.../dns-client/lib`
 * - When run through ncc, the files in `lib` are concatinated then placed in `.../dns-client/build`
 * This makes it simple to log to the root directory regardless of how the app is run by removing
 * the last directory from the path
 */
const destination = `${__dirname}/../ddns-client.log`

const transport = pino.transport({
    targets: [{
        target: 'pino/file',
        level: process.env.LOG_LEVEL || 'info',
        options: { destination }
    }]
})

const logger = pino(transport)
export default logger
