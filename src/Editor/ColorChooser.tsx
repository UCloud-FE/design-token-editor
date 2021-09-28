import React, { useCallback, useContext, useMemo, MouseEvent } from 'react';

import DesignTokenContext from '../DesignTokenContext';
import Pop from '../Pop';
import { oldKeyToNew, biToGroups, biKeyToValue } from '../utils';
import cls from './index.module.scss';

const ColorChooser = ({
    value,
    onChange,
    showValue = true,
}: {
    value: string;
    onChange: (v: string) => void;
    showValue?: boolean;
}) => {
    const { bi } = useContext(DesignTokenContext);
    const groups = useMemo(() => biToGroups(bi), []);
    const handleChange = useCallback((e: MouseEvent) => {
        const target = e.target as HTMLLIElement;
        const value = target.dataset['value'];
        value && onChange(`{${value}}`);
    }, []);
    const color = biKeyToValue(value, bi.color);

    return (
        <Pop
            popup={
                <ul className={cls['color-group-list']}>
                    {groups.map(({ group, info }) => {
                        return (
                            <li className={cls['group']} key={group}>
                                <h2 className={cls['group-name']}>{group}</h2>
                                <ul className={cls['color-list']}>
                                    {info.map((s, i) => {
                                        const { value: _value, comment, parent, key } = s;
                                        const fullKey = [...parent, key].join('.');
                                        const active = oldKeyToNew(value) === fullKey;
                                        return (
                                            <li
                                                key={fullKey}
                                                data-active={active}
                                                data-value={fullKey}
                                                className={cls['color-square']}
                                                title={comment}
                                                style={{ backgroundColor: _value }}
                                                onClick={handleChange}
                                            />
                                        );
                                    })}
                                </ul>
                            </li>
                        );
                    })}
                </ul>
            }
        >
            <div className={cls['color-chooser']}>
                <div className={cls['color-square']} style={{ backgroundColor: color }} />
                <div className={cls['color-value']} hidden={!showValue}>
                    {color}
                </div>
            </div>
        </Pop>
    );
};

export default ColorChooser;
