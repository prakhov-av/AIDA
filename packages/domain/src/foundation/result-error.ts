export class ResultError extends Error {
    public constructor(message: string) {
        super(message);

        this.name = "ResultError";
    }
}