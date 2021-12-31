const ensureProperty = (obj: Record<string, any>, path: string[]) => {
    const ensure = (_obj: Record<string, any>, key: string) => {
        if (!(key in _obj)) _obj[key] = {};
        return _obj[key];
    };
    return path.reduce((obj, k) => {
        return ensure(obj, k);
    }, obj);
};

const getPatch = <T extends Record<string, any>>(
    obj1: T,
    obj2: Partial<T>,
    parent: string[] = [],
    result: any = {},
) => {
    for (const key in obj1) {
        const v1 = obj1[key];
        const path = parent.concat(key);
        if (!(key in obj2)) {
            continue;
        }
        const v2 = obj2[key];
        if (typeof v1 !== 'object') {
            if (v1 !== v2) {
                ensureProperty(result, parent)[key] = v2;
            }
            continue;
        }
        getPatch(v1, obj2[key] as Partial<typeof v1>, path, result);
    }
    return result;
};

export { getPatch };
