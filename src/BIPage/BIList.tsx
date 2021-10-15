import React, { useMemo, useContext, useCallback } from 'react';

import cls from './index.module.scss';

import { biToGroups, keyToValue, nameToTarget, targetToName } from '../utils';
import EditContext from '../EditContext';

const BIList = ({
    value,
    onChange,
}: {
    value: string[];
    onChange: (value: string[]) => void;
}) => {
    const { bi, dt, dtc } = useContext(EditContext);
    const groups = useMemo(() => biToGroups(bi), [bi]);
    const handleColorChange = useCallback(
        (e) => {
            const dataset = (e.target as HTMLElement).dataset;
            if (dataset.value) {
                onChange(nameToTarget(dataset.value));
            }
        },
        [onChange],
    );
    const getRelevantToken = () => {
        const groups: any = {};
        const dig = (map: any, parent: string[], group?: string) => {
            if (map._meta?.group) {
                if (group) {
                    console.error(
                        `Group hierarchy disorder: ${group} ${map._meta.group}`,
                    );
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
                    if (new RegExp(`{${value.join('.')}}`).test(info.value)) {
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
        const dtGroups: any = {};
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
                    if (new RegExp(`{${value.join('.')}}`).test(info.value)) {
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
        return { ...groups, ...dtGroups };
    };
    console.log(getRelevantToken(), dtc, dt);

    return (
        <div className={cls['bi-list']}>
            <ul className={cls['color-group-list']}>
                {groups.map(({ group, info }) => {
                    return (
                        <li className={cls['group']} key={group}>
                            <h2 className={cls['group-name']}>{group}</h2>
                            <ul className={cls['color-list']}>
                                {info.map((s, i) => {
                                    const { value: _value, comment, parent, key } = s;
                                    const fullKey = targetToName([...parent, key]);
                                    let color = keyToValue(_value, bi.color);
                                    return (
                                        <li
                                            key={fullKey}
                                            data-value={fullKey}
                                            className={cls['color-square']}
                                            title={comment}
                                            style={{ background: color }}
                                            onClick={handleColorChange}
                                        />
                                    );
                                })}
                            </ul>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default React.memo(BIList);
