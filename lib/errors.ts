import log from './log'

export class ProgramError extends Error {
    constructor (public message:string, public cause?:unknown) {
        super(message)

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, ProgramError)
        }

        log.error(this)
    }
}

export class APIError extends ProgramError {
    constructor (public message:string, public cause?:unknown, public context?:object) {
        super(message, cause)
        log.error(this)
    }
}
