import type {
    StdAPI,
    RetAPI,
    PlainAPI,
    ArgAPI,
    ZodBase,
} from '@/def'
import { z } from 'zod'
import _axios, { Axios, AxiosRequestConfig } from 'axios'
import type { Result } from '@/Result'
export interface RequestInfoWithArg<DTO extends ZodBase> {
    api: StdAPI<DTO, any> | ArgAPI<DTO>
    data: z.output<DTO>
    axios?: Axios
    requestConfig?: AxiosRequestConfig
}
export interface RequestInfoNoArg {
    api: RetAPI<any> | PlainAPI
    axios?: Axios
    requestConfig?: AxiosRequestConfig
}
export async function callAPI<
    DTO extends ZodBase,
    VO extends ZodBase,
>(req: RequestInfoWithArg<DTO>): Promise<z.output<VO>>
export async function callAPI<VO extends ZodBase>(
    req: RequestInfoNoArg
): Promise<z.output<VO>>

export async function callAPI(req: any): Promise<any> {
    const axios = req.axios ?? _axios
    const requestConfig = req.requestConfig ?? {}
    requestConfig.url = req.api.path
    requestConfig.method = 'post'
    requestConfig.headers ??= {}
    requestConfig.headers['Content-Type'] =
        'application/json'
    if (req.api.dtoSchema) {
        await (req.api.dtoSchema as ZodBase).parseAsync(
            req.data
        )
    }
    requestConfig.data = JSON.stringify(req.data ?? {})
    const resp = await axios.request(requestConfig)
    if (resp.status !== 200) {
        throw new Error('Status code is not 200')
    }
    const result: Result<z.output<any>> = resp.data
    if (typeof result.success !== 'boolean') {
        throw new Error('Invalid response')
    }
    if (result.success) {
        if (req.api.voSchema) {
            await req.api.voSchema.parseAsync(result.data)
        }
        return result.data
    } else {
        console.warn(
            `Invalid response code=${result.code},msg=${result.msg}`
        )
        throw new Error(result.msg ?? 'Unknown error')
    }
}
