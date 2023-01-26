type ErrorType = 'UpdateError' | 'CreateError' | 'GetRecordsError'

export class APIError<T extends ErrorType> extends Error {
    name:T
    cause?:unknown
    message:string

    constructor (name:T, message:string, cause?:unknown) {
        super(message)
        this.cause = cause
        this.name = name
        this.message = message

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, APIError)
        }
    }
}
