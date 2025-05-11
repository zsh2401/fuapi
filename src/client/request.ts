import type {
    StdAPI,
    RetAPI,
    PlainAPI,
    ArgAPI,
    ZodBase,
} from '@/def'
import { z, ZodError } from 'zod'
import _axios, { Axios, AxiosRequestConfig } from 'axios'
import type { Result } from '@/Result'
import { InvalidDTOError } from '@/InvalidDTOError'
import { InvalidVOError } from '@/InvalidVOError'
import { APIError } from '@/APIError'
export interface RequestInfoWithArg<DTO extends ZodBase> {
    api: StdAPI<DTO, any> | ArgAPI<DTO>
    data: z.output<DTO>
    axios?: Axios
    requestConfig?: AxiosRequestConfig
}
export interface RequestInfoNoArg {
    api: RetAPI<any> | PlainAPI
    data: void
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

export async function callAPI(
    req: RequestInfoWithArg<any> | RequestInfoNoArg
): Promise<any> {
    const axios = req.axios ?? _axios
    const requestConfig = req.requestConfig ?? {}
    requestConfig.url = req.api.path
    requestConfig.method = 'post'
    requestConfig.headers ??= {}
    requestConfig.headers['Content-Type'] =
        'application/json'
    if (typeof req.api.dtoSchema === 'object') {
        try {
            await (req.api.dtoSchema as ZodBase).parseAsync(
                req.data
            )
        } catch (err: unknown) {
            if (err instanceof ZodError) {
                throw new InvalidDTOError(err)
            } else {
                throw new InvalidDTOError()
            }
        }
    }
    requestConfig.data = JSON.stringify(req.data)
    requestConfig.responseType = 'json'
    // requestConfig.

    const resp = await axios.request(requestConfig)

    if (resp.status !== 200) {
        throw new APIError(resp.status, 'Unknown error')
    }

    const result: Result<z.output<any>> = resp.data
    console.log('Direct response data', resp.data)
    // console.log(resp.data)
    if (typeof result.success !== 'boolean') {
        throw new APIError(
            500,
            'Invalid response data format'
        )
    }

    if (result.success) {
        if (req.api.voSchema) {
            try {
                await (
                    req.api.voSchema as ZodBase
                ).parseAsync(req.data)
            } catch (err: unknown) {
                if (err instanceof ZodError) {
                    throw new InvalidVOError(err)
                } else {
                    throw new InvalidVOError()
                }
            }
        }

        return result.data
    } else {
        console.warn(
            `Invalid response code=${result.code},msg=${result.msg}`
        )
        throw new APIError(
            result.code,
            result.msg ?? 'Unknown error'
        )
    }
}
