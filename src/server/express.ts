import type { Express, Request } from "express"
import { z } from "zod"
import { API, FullAPI, NoArgAPI, NoIOApi, NoRetAPI, ZodBase } from "@/def"
import { ofError, ofSuccess, type Result } from "@/Result"

/**
 * The args of express handler implementation
 */
export interface ExpressHandlerArgs<DTO> {
    request: Express.Request
    response: Express.Response
    dto: DTO
}
export type ExpressAPIHandler<T extends API<any, any>> =
    T extends FullAPI<infer DTO, infer VO> ? (args: ExpressHandlerArgs<T['dtoSchema']>) => Promise<T['voSchema']> :
    T extends NoRetAPI<infer VO> ? (dto: ExpressHandlerArgs<T['dtoSchema']>) => Promise<void> :
    T extends NoArgAPI<infer VO> ? () => T['voSchema'] :
    () => Promise<void>
/**
 * Implement your api on express instance
 * @param impl 
 */
export function implAPIOnExpress<DTO extends ZodBase>(express: Express, api: NoRetAPI<DTO>, handler: ExpressAPIHandler<NoRetAPI<z.output<DTO>>>): void

export function implAPIOnExpress<VO extends ZodBase>(express: Express, api: NoArgAPI<VO>, handler: (dto: ExpressHandlerArgs<void>) => Promise<z.output<VO>>): void

export function implAPIOnExpress(express: Express, api: NoIOApi, handler: (dto: ExpressHandlerArgs<void>) => Promise<void>): void

export function implAPIOnExpress<DTO extends ZodBase, VO extends ZodBase>(express: Express, api: FullAPI<DTO, VO>, handler: (dto: ExpressHandlerArgs<z.output<DTO>>) => Promise<z.output<VO>>): void

export function implAPIOnExpress(express: any, api: any, handler: any): void {
    if (api.path.toLowerCase() !== api.path) {
        throw new Error("API path must be all lowercase")
    }
    express.post(api.path, async (request, response) => {
        const args: ExpressHandlerArgs<z.output<any>> = {
            request, response, dto: {} as z.output<any>
        }
        let result: Result<any>
        try {
            if (api.dtoSchema) {
                if (request.headers["content-type"] === "application/json") {
                    const json: string = await readRequestBodyAsString(request)
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
        response.setHeader("Content-Type", "application/json")
        response.send(str)
    })
}

async function readRequestBodyAsString(request: Request): Promise<string> {
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
