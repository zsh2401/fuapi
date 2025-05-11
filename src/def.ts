import { z } from 'zod'

export type ZodBase = z.ZodObject<any, any, any, any>
export type API<DTO extends ZodBase, VO extends ZodBase> =
    | StdAPI<DTO, VO>
    | RetAPI<VO>
    | ArgAPI<DTO>
    | PlainAPI

export interface StdAPI<
    DTO extends ZodBase,
    VO extends ZodBase,
> {
    path: string
    dtoSchema: DTO
    voSchema: VO
}

export interface ArgAPI<DTO extends ZodBase> {
    path: string
    dtoSchema: DTO
    voSchema?: void
}

export interface RetAPI<VO extends ZodBase> {
    path: string
    dtoSchema?: void
    voSchema: VO
}
export interface PlainAPI {
    path: string
    dtoSchema?: void
    voSchema?: void
}

export function defineAPI<
    DTO extends ZodBase,
    VO extends ZodBase,
>(def: StdAPI<DTO, VO>): StdAPI<DTO, VO>
export function defineAPI<DTO extends ZodBase>(
    def: ArgAPI<DTO>
): ArgAPI<DTO>
export function defineAPI<VO extends ZodBase>(
    def: RetAPI<VO>
): RetAPI<VO>
export function defineAPI(def: PlainAPI): PlainAPI

export function defineAPI(def: any): any {
    return def
}
