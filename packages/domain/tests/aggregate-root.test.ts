import { describe, expect, it } from 'vitest';

import { AggregateRoot, Identity } from '../src';

class TestId extends Identity<string> {
    public constructor(value: string) {
        super(value);
    }
}

class TestAggregateRoot extends AggregateRoot<TestId> {
    public constructor(id: TestId) {
        super(id);
    }
}

describe('AggregateRoot', () => {
    it('extends Entity', () => {
        const id = new TestId('1');
        const aggregate = new TestAggregateRoot(id);

        expect(aggregate).toBeInstanceOf(AggregateRoot);
    });

    it('exposes identity', () => {
        const id = new TestId('1');
        const aggregate = new TestAggregateRoot(id);

        expect(aggregate.id).toBe(id);
    });

    it('uses identity equality inherited from Entity', () => {
        const id = new TestId('1');

        const left = new TestAggregateRoot(id);
        const right = new TestAggregateRoot(id);

        expect(left.equals(right)).toBe(true);
    });

    it('is not equal when identities differ', () => {
        const left = new TestAggregateRoot(new TestId('1'));
        const right = new TestAggregateRoot(new TestId('2'));

        expect(left.equals(right)).toBe(false);
    });

    it('is not equal when runtime types differ', () => {
        class AnotherAggregateRoot extends AggregateRoot<TestId> {
            public constructor(id: TestId) {
                super(id);
            }
        }

        const id = new TestId('1');

        const left = new TestAggregateRoot(id);
        const right = new AnotherAggregateRoot(id);

        expect(left.equals(right)).toBe(false);
    });
});