import { z } from 'zod'

export type ZodBase = z.ZodObject<any, any, any, any>
export type API<DTO extends ZodBase, VO extends ZodBase> =
    | FullAPI<DTO, VO>
    | NoArgAPI<VO>
    | NoRetAPI<DTO>
    | NoIOApi

export interface FullAPI<
    DTO extends ZodBase,
    VO extends ZodBase,
> {
    path: string
    dtoSchema: DTO
    voSchema: VO
}

export interface NoRetAPI<DTO extends ZodBase> {
    path: string
    dtoSchema: DTO
    voSchema?: void
}
export interface NoArgAPI<VO extends ZodBase> {
    path: string
    dtoSchema?: void
    voSchema: VO
}
export interface NoIOApi {
    path: string
    dtoSchema?: void
    voSchema?: void
}

export function defineAPI<
    DTO extends ZodBase,
    VO extends ZodBase,
>(def: FullAPI<DTO, VO>): FullAPI<DTO, VO>
export function defineAPI<DTO extends ZodBase>(
    def: NoRetAPI<DTO>
): NoRetAPI<DTO>
export function defineAPI<VO extends ZodBase>(
    def: NoArgAPI<VO>
): NoArgAPI<VO>
export function defineAPI(def: NoIOApi): NoIOApi
export function defineAPI(def: any) {
    return def
}
