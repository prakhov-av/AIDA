import type {
    AggregateRoot,
    Identity,
    Option,
    Repository,
} from "@aida/domain";
import { none, some } from "@aida/domain";

type Change<
    TAggregate extends AggregateRoot<TId>,
    TId extends Identity<unknown>,
> =
    | {
    readonly kind: "save";
    readonly aggregate: TAggregate;
}
    | {
    readonly kind: "delete";
    readonly id: TId;
};

export class InMemoryRepository<
    TAggregate extends AggregateRoot<TId>,
    TId extends Identity<unknown>,
> implements Repository<TAggregate, TId> {
    private readonly aggregates: TAggregate[] = [];

    private readonly changes: Change<
        TAggregate,
        TId
    >[] = [];

    public async findById(
        id: TId,
    ): Promise<Option<TAggregate>> {
        for (
            let index = this.changes.length - 1;
            index >= 0;
            index -= 1
        ) {
            const change = this.changes[index];

            if (change === undefined) {
                continue;
            }

            if (change.kind === "delete") {
                if (change.id.equals(id)) {
                    return none();
                }

                continue;
            }

            if (change.aggregate.id.equals(id)) {
                return some(change.aggregate);
            }
        }

        const aggregate = this.aggregates.find(
            (candidate) => candidate.id.equals(id),
        );

        return aggregate === undefined
            ? none()
            : some(aggregate);
    }

    public async save(
        aggregate: TAggregate,
    ): Promise<void> {
        this.changes.push({
            kind: "save",
            aggregate,
        });
    }

    public async delete(
        id: TId,
    ): Promise<void> {
        this.changes.push({
            kind: "delete",
            id,
        });
    }

    public commit(): void {
        for (const change of this.changes) {
            if (change.kind === "delete") {
                const index = this.aggregates.findIndex(
                    (candidate) =>
                        candidate.id.equals(change.id),
                );

                if (index !== -1) {
                    this.aggregates.splice(index, 1);
                }

                continue;
            }

            const index = this.aggregates.findIndex(
                (candidate) =>
                    candidate.id.equals(
                        change.aggregate.id,
                    ),
            );

            if (index === -1) {
                this.aggregates.push(
                    change.aggregate,
                );
            } else {
                this.aggregates[index] =
                    change.aggregate;
            }
        }

        this.changes.length = 0;
    }

    public rollback(): void {
        this.changes.length = 0;
    }
}