import type { CommonAPIDefinition, ZodBase } from "@/def";
import { z } from "zod"
import _axios, { Axios, AxiosRequestConfig } from "axios"
import type { Result } from "@/Result";
export interface RequestAPIInfo<DTO extends ZodBase, VO extends ZodBase> {
    target: CommonAPIDefinition<DTO, VO>
    data: z.output<DTO>
    axios?: Axios
    requestConfig?: AxiosRequestConfig
}
export async function requestAPI<DTO extends ZodBase, VO extends ZodBase>(
    req: RequestAPIInfo<DTO, VO>): Promise<z.output<VO>> {
    const axios = req.axios ?? _axios
    const requestConfig = req.requestConfig ?? {}
    requestConfig.url = req.target.path
    requestConfig.method = "post"
    requestConfig.headers ??= {}
    requestConfig.headers["Content-Type"] = "application/json"
    requestConfig.data = JSON.stringify(req.data)
    const resp = await axios.request(requestConfig)
    if (resp.status !== 200) {
        throw new Error("Status code is not 200")
    }
    const result: Result<z.output<VO>> = resp.data
    if (typeof result.success !== "boolean") {
        throw new Error("Invalid response")
    }
    if (result.success) {
        return result.data
    } else {
        console.warn(`Invalid response code=${result.code},msg=${result.msg}`)
        throw new Error(result.msg ?? "Unknown error")
    }
}