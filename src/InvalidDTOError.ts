import { ZodError } from 'zod'
import { APIError } from './APIError'

export class InvalidDTOError extends APIError {
    constructor(public readonly zodError?: ZodError) {
        super(403, 'Invalid input error')
    }
}
