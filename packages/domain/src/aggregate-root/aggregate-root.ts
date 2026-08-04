import { Entity } from "../entity";
import type { Identity } from "../foundation/identity";

export abstract class AggregateRoot<
    TId extends Identity<unknown>,
> extends Entity<TId> {}