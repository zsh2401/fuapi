import type { Express, Request } from "express"
import { z } from "zod"
import { ZAPI, ZodBase } from "@/def"
import { ofError, ofSuccess, type Result } from "@/Result"

/**
 * The args of express handler implementation
 */
export interface HandlerArgs<DTO> {
    request: Express.Request
    response: Express.Response
    dto: DTO
}

/**
 * The implementation of api
 */
export interface ExpressImplementation<DTO extends ZodBase, VO extends ZodBase> {
    express: Express
    def: ZAPI<DTO, VO>
    handler: (dto: HandlerArgs<z.output<DTO>>) => Promise<VO>
}
/**
 * Implement your api on express instance
 * @param impl 
 */
export function implExpress<DTO extends ZodBase, VO extends ZodBase>(impl: ExpressImplementation<DTO, VO>): void {
    if (impl.def.path.toLowerCase() !== impl.def.path) {
        throw new Error("API path must be all lowercase")
    }

    impl.express.post(impl.def.path, async (request, response) => {
        const args: HandlerArgs<z.output<DTO>> = {
            request, response, dto: {} as z.output<DTO>
        }
        let result: Result<z.output<VO>>
        try {
            if (impl.def.dtoType) {
                if (request.headers["content-type"] === "application/json") {
                    const json: string = await readRequestBodyAsString(request)
                    const obj = JSON.parse(json)
                    await (impl.def.dtoType as ZodBase).parseAsync(obj)
                    args.dto = obj
                }
            }
            result = ofSuccess(await impl.handler(args))
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