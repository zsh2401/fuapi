import type { Express, Request } from 'express'
import { z } from 'zod'
import type {
    API,
    FullAPI,
    NoArgAPI,
    NoIOApi,
    NoRetAPI,
    ZodBase,
} from '@/def'
import { ofError, ofSuccess, type Result } from '@/Result'

/**
 * The args of express handler implementation
 */
export type HandlerArgs<DTO extends ZodBase | void> =
    DTO extends ZodBase ?
    {
        request: Express.Request
        response: Express.Response
        dto: z.output<DTO>
    }
    :
    {
        request: Express.Request
        response: Express.Response
    }

export type HandlerResult<VO extends ZodBase | void> =
    VO extends ZodBase ?
    Promise<z.output<VO>> : Promise<void>

export interface Handler<DTO extends ZodBase | void, VO extends ZodBase | void> {
    (args: HandlerArgs<DTO>): HandlerResult<VO>
}

/**
 * Implement your api on express instance
 */
export function implApi<
    DTO extends ZodBase,
    VO extends ZodBase,
>(
    express: Express,
    api: FullAPI<DTO, VO>,
    handler: Handler<DTO, VO>
): void

/**
 * Implement your no argument api on express instance
 */
export function implApi<VO extends ZodBase>(
    express: Express,
    api: NoArgAPI<VO>,
    handler: Handler<void, VO>
): void
/**
 * Implement your no returning api on express instance
 */
export function implApi<DTO extends ZodBase>(
    express: Express,
    api: NoRetAPI<DTO>,
    handler: Handler<DTO, void>
): void


/**
 * Implement your no returning api on express instance
 */
export function implApi(
    express: Express,
    api: NoIOApi,
    handler: Handler<void, void>
): void


export function implApi(
    express: Express,
    api: any,
    handler: any
):
    void {
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
                        await readRequestBodyAsString(request)
                    const obj = JSON.parse(json)
                    await (api.dtoSchema as ZodBase).parseAsync(obj)
                    args.dto = obj
                }
            }
            result = ofSuccess(await handler(args))
        } catch (err: unknown) {
            result = ofError(err)
        }
        const str = JSON.stringify(result)
        response.setHeader('Content-Type', 'application/json')
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
