import { BIToken, BITokenGroup } from '../interface';
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
