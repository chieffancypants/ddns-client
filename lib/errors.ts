interface OptionsWithContext extends ErrorOptions {
    context?: object
}

export class BaseError extends Error {
    constructor (public message:string, opts?:ErrorOptions ) {
        super(message, opts)

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, BaseError)
        }
    }
}

export class ProgramError extends BaseError {
    constructor (public message:string, opts?:ErrorOptions) {
        super(message, opts)
    }
}

interface HTTPErrorOptions {
    cause?:Error
    context?:HttpContext
}

interface HttpContext {
    url:string
    statusCode:number
    statusMessage:string
    body:string
    responseHeaders:object
}

export class HTTPError extends BaseError {
    context?:HttpContext
    constructor (message:string, { cause, context }:HTTPErrorOptions) {
        super(message, { cause })
        if (context) this.context = context
    }
}


export class APIError extends BaseError {
    context?: OptionsWithContext['context']
    constructor (public message:string, { cause, context }:OptionsWithContext) {
        super(message, { cause })
        this.context = context
    }
}
