import {
  API,
  RetAPI,
  PlainAPI as PlainAPI,
  ArgAPI,
  ZodBase,
  StdAPI,
} from '@/def'
import type { Axios, AxiosRequestConfig } from 'axios'
import { z } from 'zod'
import {
  callAPI,
  RequestInfoNoArg,
  RequestInfoWithArg,
} from './request'
export interface ApiClient<DTO, VO> {
  (data: DTO): Promise<VO>
}
export interface NoArgClientInfo<VO extends ZodBase> {
  api: RetAPI<VO>
  axios?: Axios
  requestConfig?: AxiosRequestConfig
}
export interface NoRetClientInfo<DTO extends ZodBase> {
  api: ArgAPI<DTO>
  axios?: Axios
  requestConfig?: AxiosRequestConfig
}
export interface NoIOClientInfo {
  api: PlainAPI
  axios?: Axios
  requestConfig?: AxiosRequestConfig
}
export interface FullAPIClientInfo<
  DTO extends ZodBase,
  VO extends ZodBase,
> {
  api: StdAPI<DTO, VO>
  axios?: Axios
  requestConfig?: AxiosRequestConfig
}
export function createAPIClient<
  DTO extends ZodBase,
  VO extends ZodBase,
>(
  clientInfo: FullAPIClientInfo<DTO, VO>
): ApiClient<z.output<DTO>, z.output<VO>>
export function createAPIClient<VO extends ZodBase>(
  clientInfo: NoArgClientInfo<VO>
): ApiClient<void, z.output<VO>>
export function createAPIClient<DTO extends ZodBase>(
  clientInfo: NoRetClientInfo<DTO>
): ApiClient<z.output<DTO>, void>
export function createAPIClient(
  clientInfo: NoIOClientInfo
): ApiClient<void, void>

export function createAPIClient(
  clientInfo: any
): ApiClient<any, any> {
  return (data: any) => {
    return callAPI({
      requestConfig: clientInfo.requestConfig,
      axios: clientInfo.axios,
      api: clientInfo.api,
      data,
    })
  }
}
