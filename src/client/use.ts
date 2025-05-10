import { ZAPI, ZodBase } from "@/def";
import type { Axios, AxiosRequestConfig } from "axios";
import { z } from "zod"
import { requestAPI } from "./request";
export interface ApiClient<DTO extends ZodBase, VO extends ZodBase> {
    (dto: z.output<DTO>): Promise<z.output<VO>>
}
export interface ClientInfo<DTO extends ZodBase, VO extends ZodBase> {
    api: ZAPI<DTO, VO>
    axios?: Axios
    requestConfig?: AxiosRequestConfig
}
export function clientOf<DTO extends ZodBase, VO extends ZodBase>(clientInfo: ClientInfo<DTO, VO>): ApiClient<DTO, VO> {
    return (data: z.output<DTO>) => {
        return requestAPI({
            requestConfig: clientInfo.requestConfig,
            axios: clientInfo.axios,
            api: clientInfo.api,
            data
        })
    }
}