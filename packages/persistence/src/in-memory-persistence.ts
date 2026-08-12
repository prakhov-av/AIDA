import type {
    AggregateRoot,
    Identity,
    Repository,
    UnitOfWork,
} from "@aida/domain";

import { InMemoryRepository } from "./in-memory-repository";

type TransactionParticipant = {
    commit(): void;
    rollback(): void;
};

export class InMemoryPersistence {
    private readonly repositories =
        new Set<TransactionParticipant>();

    private readonly unitOfWorkInstance: UnitOfWork = {
        commit: async (): Promise<void> => {
            for (const repository of this.repositories) {
                repository.commit();
            }
        },

        rollback: async (): Promise<void> => {
            for (const repository of this.repositories) {
                repository.rollback();
            }
        },
    };

    public get unitOfWork(): UnitOfWork {
        return this.unitOfWorkInstance;
    }

    public createRepository<
        TAggregate extends AggregateRoot<TId>,
        TId extends Identity<unknown>,
    >(): Repository<TAggregate, TId> {
        const repository = new InMemoryRepository<
            TAggregate,
            TId
        >();

        this.repositories.add(repository);

        return repository;
    }
}