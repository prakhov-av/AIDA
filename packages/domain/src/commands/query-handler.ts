import type { Query } from "./query";

/**
 * Defines a handler responsible for executing a query.
 *
 * @typeParam TQuery The query type handled by this handler.
 * @typeParam TResult The result type returned by the query.
 */
export interface QueryHandler<
    TQuery extends Query<TResult>,
    TResult,
> {
    /**
     * Executes the specified query.
     *
     * @param query The query to execute.
     * @returns A promise that resolves to the query result.
     */
    handle(query: TQuery): Promise<TResult>;
}