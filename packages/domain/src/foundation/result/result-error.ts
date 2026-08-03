/**
 * Thrown when a Result is accessed incorrectly.
 */
export class ResultError extends Error {
    public constructor(message: string) {
        super(message);

        this.name = "ResultError";

        Object.setPrototypeOf(this, new.target.prototype);
    }
}