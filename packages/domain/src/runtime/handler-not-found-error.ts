/**
 * Thrown when no handler has been registered
 * for the requested application request.
 */
export class HandlerNotFoundError extends Error {
    public constructor(requestName: string) {
        super(
            `No handler registered for '${requestName}'.`,
        );

        this.name = "HandlerNotFoundError";

        Object.setPrototypeOf(
            this,
            new.target.prototype,
        );
    }
}