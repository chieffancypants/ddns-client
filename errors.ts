type ErrorType = 'UpdateError' | 'CreateError'

export class APIError<T extends ErrorType> extends Error {
    name:T
    cause?:object
    message:string

    constructor (name:T, message:string, cause?:object) {
        super(message)
        this.cause = cause
        this.name = name
        this.message = message

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, APIError)
        }
    }
}
