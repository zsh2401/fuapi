export class APIError extends Error {
    constructor(
        public readonly code: number,
        msg: string
    ) {
        super(msg)
    }
}
