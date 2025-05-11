/* eslint-disable @typescript-eslint/no-unsafe-argument */
import type { Express, Request } from 'express'
import { z } from 'zod'
import type {
    API,
    StdAPI,
    RetAPI,
    PlainAPI,
    ArgAPI,
    ZodBase,
} from '@/def'
import { ofError, ofSuccess, type Result } from '@/Result'

/**
 * The args of express handler implementation
 */
export interface HandlerArgs<DTO extends ZodBase | void> {
    request: Express.Request
    response: Express.Response
    dto: DTO extends ZodBase ? z.output<DTO> : void
}
export type HandlerResult<VO extends ZodBase | void> =
    VO extends ZodBase
        ? Promise<z.output<VO>>
        : Promise<void>

export interface Handler<
    DTO extends ZodBase | void,
    VO extends ZodBase | void,
> {
    (args: HandlerArgs<DTO>): HandlerResult<VO>
}

/**
 * Implement your <b>standard api</b> on express instance
 * @param express
 * @param api
 * @param handler
 */
export function implApi<
    DTO extends ZodBase,
    VO extends ZodBase,
>(
    express: Express,
    api: StdAPI<DTO, VO>,
    handler: Handler<DTO, VO>
): void
/**
 * Implement your <b>standard api</b> on express instance
 * @param impl
 */
export function implApi<
    DTO extends ZodBase,
    VO extends ZodBase,
>(impl: {
    express: Express
    api: StdAPI<DTO, VO>
    handler: Handler<DTO, VO>
}): void

/**
 * Implement your <b>return value api</b> on express instance
 * @param express
 * @param api
 * @param handler
 */
export function implApi<VO extends ZodBase>(
    express: Express,
    api: RetAPI<VO>,
    handler: Handler<void, VO>
): void
/**
 * Implement your <b>return value api</b> on express instance
 * @param args
 */
export function implApi<VO extends ZodBase>(args: {
    express: Express
    api: RetAPI<VO>
    handler: Handler<void, VO>
}): void

/**
 * Implement your <b>receive arg api</b> on express instance
 */
export function implApi<DTO extends ZodBase>(
    express: Express,
    api: ArgAPI<DTO>,
    handler: Handler<DTO, void>
): void
/**
 * Implement your <b>receive arg api</b> on express instance
 * @param args
 */
export function implApi<DTO extends ZodBase>(args: {
    express: Express
    api: ArgAPI<DTO>
    handler: Handler<DTO, void>
}): void

/**
 * Implement your <b>plain api</b> on express instance
 */
export function implApi(
    express: Express,
    api: PlainAPI,
    handler: Handler<void, void>
): void
/**
 * Implement your <b>plain api</b> on express instance
 */
export function implApi(args: {
    express: Express
    api: PlainAPI
    handler: Handler<void, void>
}): void

export function implApi(...args: any[]) {
    if (args.length === 3) {
        const [express, api, handler] = args
        _implApi(express, api, handler)
    } else {
        const { express, api, handler } = args[0]
        _implApi(express, api, handler)
    }
}
//
function _implApi(
    express: Express,
    api: any,
    handler: any
): void {
    if (api.path.toLowerCase() !== api.path) {
        throw new Error('API path must be all lowercase')
    }
    express.post(api.path, async (request, response) => {
        const args: HandlerArgs<z.output<any>> = {
            request,
            response,
            dto: {} as z.output<any>,
        }
        let result: Result<any>
        try {
            if (api.dtoSchema) {
                if (
                    request.headers['content-type'] ===
                    'application/json'
                ) {
                    const json: string =
                        await readRequestBodyAsString(
                            request
                        )
                    const obj = JSON.parse(json)
                    await (
                        api.dtoSchema as ZodBase
                    ).parseAsync(obj)
                    args.dto = obj
                }
            }
            result = ofSuccess(await handler(args))
        } catch (err: unknown) {
            result = ofError(err)
        }
        const str = JSON.stringify(result)
        response.setHeader(
            'Content-Type',
            'application/json'
        )
        response.send(str)
    })
}

async function readRequestBodyAsString(
    request: Request
): Promise<string> {
    return new Promise<string>((resolve) => {
        let data = ''

        request.on('readable', () => {
            let chunk
            while ((chunk = request.read()) !== null) {
                data += chunk
            }
        })

        request.on('end', () => {
            resolve(data)
        })
    })
}
