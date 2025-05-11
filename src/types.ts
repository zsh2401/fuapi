import { z } from 'zod'
import { ZodBase } from './def'

export type ReturnType<T> = T extends { voSchema: ZodBase }
    ? z.output<T['voSchema']>
    : void
export type ArgType<T> = T extends { dtoSchema: ZodBase }
    ? z.output<T['dtoSchema']>
    : void
