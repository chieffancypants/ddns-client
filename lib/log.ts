import pino from 'pino'

const transport = pino.transport({
    targets: [{
        target: 'pino/file',
        level: process.env.LOG_LEVEL || 'info',
        options: { destination: `${__dirname}/../ddns-client.log` }
    }]
})

const logger = pino(transport)
export default logger
