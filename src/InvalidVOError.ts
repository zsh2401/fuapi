import { ZodError } from "zod";
import { APIError } from "./APIError";

export class InvalidVOError extends APIError {
    constructor(public readonly zodError?: ZodError){
        super(500, "Invalid server result")
    }
}