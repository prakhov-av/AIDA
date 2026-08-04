import type { AggregateRoot } from "../aggregate-root";
import type { Identity } from "../foundation";
import type { Option } from "../option";

export abstract class Repository<
    TAggregate extends AggregateRoot<TId>,
    TId extends Identity<unknown>,
> {
    public abstract findById(id: TId): Promise<Option<TAggregate>>;

    public abstract save(aggregate: TAggregate): Promise<void>;

    public abstract delete(id: TId): Promise<void>;
}