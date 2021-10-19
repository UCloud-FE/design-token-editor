import React, { useCallback, useContext, useState, useMemo } from 'react';

import cls from './index.module.scss';

import tokens from '../../dt/full.json';
import { nameToTarget, usedKey } from '../utils';
import EditContext from '../EditContext';
import Color from '../Editor/Color';
import Gradient from '../Editor/Gradient';

const getRelevantToken = (
    value: string[],
    dtc: typeof tokens['common'],
    dt: typeof tokens['component'],
) => {
    interface TokenInfo {
        value: string;
        comment: string;
        type?: string;
        parent: string[];
        key: string;
    }
    interface GroupMap {
        [key: string]: TokenInfo[];
    }
    const groups: GroupMap = {};
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
            if (typeof info !== 'object') continue;
            if ('value' in info) {
                if (!group) {
                    console.error(`Can't find group for`, info);
                    break;
                }
                console.log(info.value, value, usedKey(info.value, value.join('.')));
                if (usedKey(info.value, value.join('.'))) {
                    groups[group].push({
                        ...info,
                        parent,
                        key,
                    });
                }
            } else {
                dig(info, [...parent, key], group);
            }
        }
    };
    dig(dtc, []);
    const dtGroups: GroupMap = {};
    const digDT = (map: any, parent: string[], group?: string) => {
        for (const key in map) {
            if (key === '_meta') continue;
            const info = map[key];
            if (typeof info !== 'object') continue;
            if ('value' in info) {
                if (!group) {
                    console.error(`Can't find group for`, info);
                    break;
                }
                console.log(info.value, value, usedKey(info.value, value.join('.')));
                if (usedKey(info.value, value.join('.'))) {
                    dtGroups[group].push({
                        ...info,
                        parent,
                        key,
                    });
                }
            } else {
                digDT(info, [...parent, key], group);
            }
        }
    };
    Object.keys(dt).forEach((key) => {
        dtGroups[key] = [];
        digDT(dt[key as keyof typeof dt], [key], key);
    });
    const result: GroupMap = {};
    Object.keys({ ...groups, ...dtGroups }).forEach((key: string) => {
        if ({ ...groups, ...dtGroups }[key]?.length) {
            result[key] = { ...groups, ...dtGroups }[key];
        }
    });
    return result;
};

const BITokenEditor = ({
    comment,
    value,
    target,
    type,
    onChange,
}: {
    comment: string;
    value: string;
    target: string;
    type?: string;
    onChange: () => void;
}) => {
    const [sValue, setSValue] = useState(value);
    const { handleBIValueChange, dtc, dt } = useContext(EditContext);
    const handleChange = useCallback(
        (v: string) => {
            const success = handleBIValueChange(nameToTarget(target), v);
            success && setSValue(v);
            onChange();
        },
        [handleBIValueChange, onChange, target],
    );
    const relevantToken = useMemo(() => {
        return getRelevantToken(nameToTarget(target), dtc, dt);
    }, [dt, dtc, target]);
    return (
        <div className={cls['bi-token-editor']}>
            <h2 className={cls['title']}>{comment}</h2>
            <div className={cls['divider']}></div>
            {type === 'gradient' ? (
                <Gradient value={sValue} onChange={handleChange} />
            ) : (
                <Color value={sValue} onChange={handleChange} />
            )}
            <h3 className={cls['sub-title']}>相关变量</h3>
            <div className={cls['divider']}></div>
            <div className={cls['relevant-tokens']}>
                {Object.keys(relevantToken).map((key) => {
                    const tokens = relevantToken[key];
                    return (
                        <div key={key}>
                            <h3>{key}</h3>
                            <ul key={key}>
                                {tokens.map((token, i) => {
                                    return (
                                        <li key={i}>
                                            <div
                                                className={cls['comment']}
                                                title={token.comment}>
                                                {token.comment}
                                            </div>
                                            <div className={cls['key']}>
                                                {['T', ...token.parent, token.key]
                                                    .join('_')
                                                    .toUpperCase()}
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default React.memo(BITokenEditor);
