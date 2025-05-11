import { APIError } from './APIError'

export type Result<VO> = SuccessResult<VO> | FailedResult

export interface SuccessResult<D> {
  success: true
  data: D
}
export interface FailedResult {
  success: false
  code: number
  msg?: string
}

export function ofSuccess<D>(data: D): Result<D> {
  return {
    success: true,
    data,
  }
}
export function ofError<D>(error: unknown): Result<D> {
  if (error instanceof APIError) {
    return {
      success: false,
      code: error.code,
      msg: error.message,
    }
  } else if (error instanceof Error) {
    return {
      success: false,
      code: 1,
      msg: error.message,
    }
  } else if (typeof error === 'string') {
    return {
      success: false,
      code: 1,
      msg: error,
    }
  } else {
    return {
      success: false,
      code: 1,
      msg: 'Unknown error',
    }
  }
}
