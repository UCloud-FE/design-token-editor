import { BIToken, BITokenGroup } from '../interface';

export const oldKeyToNew = (color: string) => {
    const value = color.replace(/^\{(.*)\}$/, '$1');
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

export const biKeyToValue = (key: string, bi: any) => {
    const newKey = oldKeyToNew(key);
    const target = newKey.replace(/^\{(.*)\}$/, '$1');
    try {
        const token = target.split('.').reduce((map, key) => {
            return map[key];
        }, bi);
        return token.value;
    } catch (error) {
        console.error(error, `key: ${key}, newKey: ${newKey}`);
        return '#FFF';
    }
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
