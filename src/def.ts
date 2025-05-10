import { z } from "zod"
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ZodBase = z.ZodObject<any, any, any, any>
export interface API<DTO extends ZodBase, VO extends ZodBase> {
    path: string
    dtoType?: DTO
    resultDataType?: VO
}

export function defineAPI<DTO extends ZodBase, VO extends ZodBase>(def: API<DTO, VO>): API<DTO, VO> {
    return def
}