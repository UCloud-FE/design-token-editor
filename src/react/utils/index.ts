import {
    BIToken,
    BITokenGroup,
    ColorInfo,
    IGradient,
    IShadow,
    Tokens,
} from '../interface';
import { transparent } from './color';

// 获得 token 的值
const tokenToValue = (target: string, bi: any) => {
    try {
        const token = target.split('.').reduce((map: any, key: string) => {
            return map?.[key];
        }, bi);
        return keyToValue(token.value, bi);
    } catch (error) {
        console.error(error, `key: ${target}`);
        return '#FFF';
    }
};

// 将 key 格式化为 key 和 transparent
export const parseColorKey = (key: string): ColorInfo => {
    let targetKey: string = key;
    const colorInfo: ColorInfo = { key: targetKey };

    if (/^#[0-9a-fA-F]{1,8}$/.test(key)) {
        colorInfo.notAKey = true;
        return colorInfo;
    }

    const dig = (key: string) => {
        const a = /^(\w+)\((.*)\)$/.exec(key);
        const [, func, args] = a || [];
        if (func) {
            if (func === 'transparent') {
                const [key, value] = args.split(',').map((v) => v.trim());
                colorInfo.transparent = { alpha: +value / 100 };
                dig(key);
            } else {
                console.error(`Unknown func type ${func}`);
            }
        } else {
            targetKey = key;
            colorInfo.key = key;
        }
    };
    dig(targetKey);
    // colorInfo.key = oldKeyToNew(colorInfo.key);
    return colorInfo;
};

export const stringifyColorKey = (colorInfo: ColorInfo) => {
    const { key, transparent } = colorInfo;
    let colorStr = key;
    if (transparent) {
        const { alpha } = transparent;
        colorStr =
            alpha === 1
                ? colorStr
                : `transparent(${colorStr}, ${(alpha * 100).toFixed(0)})`;
    }
    return colorStr;
};

export const trimKey = (key: string) => key.replace(/^\{(.*)\}$/, '$1');

export const biKeyToValue = (key: string, bi: any) => {
    const newKey = trimKey(key);
    const {
        key: colorKey,
        transparent: transparentInfo,
        notAKey,
    } = parseColorKey(newKey);
    let value = notAKey ? colorKey : tokenToValue(colorKey, bi);
    return transparentInfo ? transparent(value, transparentInfo.alpha * 100) : value;
};

export const keyToValue = (key: string, bi: any): string => {
    return key.replace(/(\{.+?\})/g, (key: string) => {
        return biKeyToValue(key, bi);
    });
};

export const usedKey = (value: string, key: string): boolean => {
    const arr = /(\{.+?\})/g.exec(value);
    if (arr) {
        const index = arr.findIndex((v) => {
            v = trimKey(v);
            const colorInfo = parseColorKey(v);
            return colorInfo.key === key;
        });
        return index >= 0;
    }
    return false;
};

export const parseGradient = (gradient: string): IGradient => {
    const [, angle = '0', start = 'base.white', end = 'base.white'] =
        /^linear-gradient\((\w+),\s*\{([\w.]+)\}\s*0%,\s*\{([\w.]+)\}\s*100%\)$/.exec(
            gradient,
        ) || [];
    return {
        angle,
        start,
        end,
    };
};

export const stringifyGradient = (gradient: IGradient): string => {
    const { angle, start, end } = gradient;
    return `linear-gradient(${angle}, {${start}} 0%, {${end}} 100%)`;
};

export const parseShadows = (shadows: string): IShadow[] => {
    const shadowArr = shadows.trim().match(/(?:.*?(?:\{.*?\}),?)|(?:.+$)/g) || [];
    return shadowArr.map((str) => {
        str = str.trim().replace(/,$/, '');
        const tokens = (str.match(/(\{.+\})|([^\s]+?\s)/g) || []).map((token) =>
            token.trim(),
        );
        if (tokens.length < 6) {
            tokens.unshift('outset');
        }
        const [type, offsetX, offsetY, blur, spread, color] = tokens;
        return { type, offsetX, offsetY, blur, spread, color: trimKey(color) };
    });
};

export const stringifyShadows = (shadows: IShadow[]) => {
    const boxShadow = shadows.map((shadow) => {
        const { type, offsetX, offsetY, blur, spread, color } = shadow;
        return (type === 'outset' ? [] : [type])
            .concat([offsetX, offsetY, blur, spread, `{${color}}`])
            .join(' ');
    });
    return boxShadow.join(', ');
};

export const shadowTokenToShadows = (shadowToken: string) => {
    let str = shadowToken.trim();
    const shadows = str.match(/(?:.*?(?:\{.*?\}),?)|(?:.+$)/g) || [];
    return shadows.map((str) => {
        str = str.trim().replace(/,$/, '');
        const tokens = (str.match(/(\{.+\})|([^\s]+?\s)/g) || []).map((token) =>
            token.trim(),
        );
        if (tokens.length < 6) {
            tokens.unshift('outset');
        }
        return tokens;
    });
};

export const shadowsToBoxShadow = (
    shadows: ReturnType<typeof shadowTokenToShadows>,
    bi: any,
) => {
    const boxShadow = shadows
        .reduce((boxShadow: string[], shadow: string[]) => {
            const [type, offsetX, offsetY, blur, spread, _color] = shadow;
            const color = biKeyToValue(_color, bi);
            return boxShadow.concat(
                (type === 'outset' ? [] : [type])
                    .concat([offsetX, offsetY, blur, spread, color])
                    .join(' '),
            );
        }, [])
        .join(', ');
    return boxShadow;
};

export const biToGroups = (bi: any) => {
    const groups: { [key: string]: BIToken[] } = {};
    const dig = (map: any, parent: string[], group?: string) => {
        if (map._meta?.group) {
            if (group) {
                console.error(`Group hierarchy disorder: ${group} ${map._meta.group}`);
            }
            group = map._meta.group as string;
            if (!(group in groups)) {
                groups[group] = [];
            }
        }
        for (const key in map) {
            if (key === '_meta') continue;
            const info = map[key];
            if ('value' in info) {
                if (!group) {
                    console.error(`Can't find group for`, info);
                    break;
                }
                groups[group].push({
                    ...info,
                    parent,
                    key,
                });
            } else {
                dig(info, [...parent, key], group);
            }
        }
    };
    dig(bi.color, ['color']);
    const groupArray: BITokenGroup[] = Object.keys(groups).map((key: string) => {
        return {
            group: key,
            info: groups[key],
        };
    });
    return groupArray;
};

export const targetToName = (target: string[]) => {
    return target.join(',');
};
export const nameToTarget = (name: string) => {
    return name.split(',');
};

export const clone = function <T>(json: T): T {
    return JSON.parse(JSON.stringify(json));
};

export const merge = function <T>(origin: T, external: Partial<T>): T {
    origin = clone(origin);
    external = clone(external);

    const dig = (obj: any, target: any) => {
        Object.keys(obj).forEach((key) => {
            const v = obj[key];
            const vType = {}.toString.call(v).slice(8, -1);
            switch (vType) {
                case 'Array':
                    target[key] = [...v];
                    break;
                case 'Undefined':
                case 'Null':
                    break;
                case 'Object':
                    if (!(key in target)) {
                        target[key] = {};
                    }
                    dig(v, target[key]);
                    break;
                default:
                    target[key] = v;
                    break;
            }
        });
    };

    dig(external, origin);
    return origin;
};

export const get = (obj: any, target: string[]) => {
    for (let i = 0; i < target.length; i++) {
        obj = obj?.[target[i]];
        if (!obj) {
            console.error(`Can't find ${target} in ${obj}`);
            return null;
        }
    }
    return obj;
};

export const sortKey = <T>(obj: T) => {
    const _obj = {} as any;
    Object.keys(obj)
        .sort()
        .map((key) => (_obj[key] = (obj as any)[key]));
    return _obj as T;
};

export const output = (tokens: Tokens) => {
    let { builtin, common, component, external } = tokens;
    const map: any = {};
    builtin = JSON.parse(JSON.stringify(builtin));
    const parseBuiltinToken = (bi: any) => {
        for (const key in bi) {
            const info = bi[key];
            if (!info || key === '_meta') continue;
            if ('value' in info && info?.value && typeof info.value === 'string') {
                if (/{.*}/.test(info.value)) {
                    info.value = keyToValue(info.value, builtin);
                }
            } else if (typeof info === 'object') {
                parseBuiltinToken(info);
            } else {
                console.error(info);
            }
        }
    };
    if (builtin) {
        for (const key in builtin) {
            if (builtin[key]) parseBuiltinToken(builtin[key]);
        }
    }

    const go = (_dt: any, prefix: string) => {
        for (const key in _dt) {
            const info = _dt[key];
            if (key === '_meta') continue;
            const fullKey = `${prefix}_${key}`.toUpperCase();
            if (info.value) {
                if (/{.*}/.test(info.value)) {
                    map[fullKey] = keyToValue(info.value, builtin);
                } else {
                    map[fullKey] = info.value;
                }
            } else {
                if (typeof info === 'object') {
                    go(info, fullKey);
                } else {
                    console.error(info, fullKey);
                }
            }
        }
    };
    go(component, 'T');
    go(common, 'T');
    go(external, 'T');
    return sortKey(map);
};

export const sleep = async (time: number) => {
    return new Promise<void>((resolve) =>
        setTimeout(() => {
            resolve();
        }, time),
    );
};
