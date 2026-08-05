/**
 * Defines a transactional boundary for coordinating application changes.
 */
export interface UnitOfWork {
    /**
     * Commits all pending changes.
     *
     * @returns A promise that resolves when the transaction has been committed.
     */
    commit(): Promise<void>;

    /**
     * Rolls back all pending changes.
     *
     * @returns A promise that resolves when the transaction has been rolled back.
     */
    rollback(): Promise<void>;
}