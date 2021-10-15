import { BIToken, BITokenGroup, IGradient, IShadow } from '../interface';
import { transparent } from './color';

const isNumberString = (v: string) => {
    return /^\d+$/.test(v);
};

export const oldKeyToNew = (value: string = '') => {
    if (value.startsWith('color.brand')) {
        const target = value.split('.');
        const type = target[2].split('_')[0];
        switch (type) {
            case 'white':
                return 'base.environment';
            case 'black':
                return 'base.environment_reverse';
            case 'transparent':
                return 'base.transparent';
            case 'primary':
                return `primary.${target[2]}`;
            case 'secondary':
                return `secondary.${target[2]}`;
            case 'system':
                return `base.${target[3]}`;
            case 'gradient':
                return `gradient.${target[3]}`;
            case 'sidebar':
                return `special.special_1`;
            case 'notice':
            case 'success':
            case 'warning':
            case 'error':
            case 'disabled':
                return `status.${target[2]}`;
            default:
                return `assist.${target[2]}`;
        }
    } else {
        return value;
    }
};

const tokenToValue = (token: string, bi: any) => {
    const target = oldKeyToNew(token);
    let isTransparent: boolean = false;
    let transparentNumber: number = 100;
    try {
        const token = target.split('.').reduce((map: any, key: string) => {
            // old transparent type
            if (isTransparent) {
                if (/^\d+$/.test(key)) {
                    throw new Error(`${key} is not a transparent number`);
                } else {
                    transparentNumber = +key;
                    return map;
                }
            }
            if (/_transparent$/.test(key)) {
                isTransparent = true;
                return map[key.replace(/_transparent$/, '')];
            }
            return map[key];
        }, bi);
        if (isTransparent) {
            return transparent(token.value, transparentNumber);
        } else {
            return keyToValue(token.value, bi);
        }
    } catch (error) {
        console.error(error, `key: ${token}`);
        return '#FFF';
    }
};

interface ColorInfo {
    key: string;
    transparent?: {
        alpha: number;
    };
}

export const parseColorKey = (key: string): ColorInfo => {
    let targetKey: string = key;
    const colorInfo: ColorInfo = { key: targetKey };
    const dig = (key: string) => {
        const a = /^(\w+)\((.*)\)$/.exec(key);
        const [, func, args] = a || [];
        if (func) {
            if (func === 'transparent') {
                const [key, value] = args.split(',').map((v) => v.trim());
                colorInfo.transparent = { alpha: +value };
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
    return colorInfo;
};
export const stringifyColorKey = (colorInfo: ColorInfo) => {
    const { key, transparent } = colorInfo;
    let colorStr = key;
    if (transparent) {
        const { alpha } = transparent;
        colorStr = `transparent(${colorStr}, ${alpha})`;
    }
    return colorStr;
};

export const biKeyToValue = (key: string, bi: any) => {
    const newKey = key.replace(/^\{(.*)\}$/, '$1');
    const funcs: { type: string; args: { [key: string]: string } }[] = [];
    let targetKey: string = newKey;
    const getFuncs = (key: string) => {
        const a = /^(\w+)\((.*)\)$/.exec(key);
        const [, func, args] = a || [];
        if (func) {
            if (func === 'transparent') {
                const [key, value] = args.split(',').map((v) => v.trim());
                funcs.push({
                    type: func,
                    args: { value },
                });
                getFuncs(key);
            } else {
                console.error(`Unknown func type ${func}`);
            }
        } else {
            targetKey = key;
        }
    };
    getFuncs(newKey);
    let value = tokenToValue(targetKey, bi);
    for (let i = funcs.length - 1; i >= 0; i--) {
        const funcInfo = funcs[i];
        switch (funcInfo.type) {
            case 'transparent': {
                if (!isNumberString(funcInfo.args.value)) {
                    console.error(`Unknown valid transparent ${funcInfo.args.value}`);
                } else {
                    value = transparent(value, +funcInfo.args.value);
                }
                break;
            }
            default: {
                console.error(`Unknown func ${funcInfo.type}`);
                break;
            }
        }
    }
    return value;
};

export const keyToValue = (key: string, bi: any): string => {
    return key.replace(/(\{.+?\})/g, (key: string) => {
        return biKeyToValue(key, bi);
    });
};

export const parseGradient = (gradient: string): IGradient => {
    const [, angle, start, end] =
        /^linear-gradient\(([^,]+)[,\s]+\{([^,{}]+)\}[\d%,\s]+\{([^,{}]+)\}[\d%,\s]+\)$/.exec(
            gradient,
        ) || [];

    console.log(angle, start, end);
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
    const shadowArr = shadows.trim().match(/(?:.*?(?:\{.*?\})?,)|(?:.+$)/g) || [];
    return shadowArr.map((str) => {
        str = str.trim().replace(/,$/, '');
        const tokens = (str.match(/(\{.+\})|([^\s]+?\s)/g) || []).map((token) =>
            token.trim(),
        );
        if (tokens.length < 6) {
            tokens.unshift('outset');
        }
        const [type, offsetX, offsetY, blur, spread, color] = tokens;
        return { type, offsetX, offsetY, blur, spread, color };
    });
};

export const stringifyShadows = (shadows: IShadow[]) => {
    const boxShadow = shadows.map((shadow) => {
        const { type, offsetX, offsetY, blur, spread, color } = shadow;
        return (type === 'outset' ? [] : [type])
            .concat([offsetX, offsetY, blur, spread, color])
            .join(' ');
    });
    return boxShadow.join(', ');
};

export const shadowTokenToShadows = (shadowToken: string) => {
    let str = shadowToken.trim();
    const shadows = str.match(/(?:.*?(?:\{.*?\})?,)|(?:.+$)/g) || [];
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
    dig(bi.color, []);
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

export const get = (obj: any, target: string[]) => {
    for (let i = 0; i < target.length; i++) {
        obj = obj[target[i]];
        if (!obj) {
            console.error(`Can't find ${target} in ${obj}`);
            return null;
        }
    }
    return obj;
};

export const output = (bi: any, dtc: any, dt: any) => {
    const map: any = {};
    const gobi = (builtin: typeof bi) => {
        for (const key in builtin) {
            const info = builtin[key];
            if (info.value) {
                if (/{.*}/.test(info.value)) {
                    info.value = keyToValue(info.value, bi.color);
                }
            } else if (typeof info === 'object') {
                gobi(info);
            } else {
                console.error(info);
            }
        }
    };

    gobi(bi);

    const go = (_dt: typeof dt, prefix: string) => {
        for (const key in _dt) {
            const info = _dt[key];
            const fullKey = `${prefix}_${key}`.toUpperCase();
            if (info.value) {
                if (/{.*}/.test(info.value)) {
                    map[fullKey] = keyToValue(info.value, bi.color);
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

    go(dt, 'T');
    go(dtc, 'T');
    console.log(map);
    return map;
};
