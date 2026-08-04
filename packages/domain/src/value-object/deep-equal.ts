function isObject(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null;
}

export function deepEqual(left: unknown, right: unknown): boolean {
    if (Object.is(left, right)) {
        return true;
    }

    if (!isObject(left) || !isObject(right)) {
        return false;
    }

    if (Array.isArray(left) !== Array.isArray(right)) {
        return false;
    }

    const leftKeys = Object.keys(left);
    const rightKeys = Object.keys(right);

    if (leftKeys.length !== rightKeys.length) {
        return false;
    }

    for (const key of leftKeys) {
        if (!(key in right)) {
            return false;
        }

        if (!deepEqual(left[key], right[key])) {
            return false;
        }
    }

    return true;
}