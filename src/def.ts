import { z } from "zod"
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ZodBase = z.ZodObject<any, any, any, any>
export interface ZAPI<DTO extends ZodBase, VO extends ZodBase> {
    path: string
    dtoType?: DTO
    resultDataType?: VO
}

export function defineCommonAPI<DTO extends ZodBase, VO extends ZodBase>(def: ZAPI<DTO, VO>): ZAPI<DTO, VO> {
    return def
}