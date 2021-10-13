import React, { useCallback, useContext, useMemo, MouseEvent } from 'react';

import Pop from '../Pop';
import { oldKeyToNew, biToGroups, biKeyToValue, keyToValue } from '../utils';
import cls from './index.module.scss';
import EditContext from '../EditContext';

const ColorChooser = ({
    value,
    onChange,
    showValue = true,
}: {
    value: string;
    onChange: (v: string) => void;
    showValue?: boolean;
}) => {
    const { bi, setPanel } = useContext(EditContext);
    const groups = useMemo(() => biToGroups(bi), [bi]);
    const handleChange = useCallback(
        (e: MouseEvent) => {
            const target = e.target as HTMLLIElement;
            const value = target.dataset['value'];
            value && onChange(`{${value}}`);
        },
        [onChange],
    );
    const color = biKeyToValue(value, bi.color);
    const goBIPanel = useCallback(() => {
        setPanel('bi');
    }, [setPanel]);

    return (
        <Pop
            popup={
                <div className={cls['color-popup']}>
                    <ul className={cls['color-group-list']}>
                        {groups.map(({ group, info }) => {
                            return (
                                <li className={cls['group']} key={group}>
                                    <h2 className={cls['group-name']}>{group}</h2>
                                    <ul className={cls['color-list']}>
                                        {info.map((s, i) => {
                                            const {
                                                value: _value,
                                                comment,
                                                parent,
                                                key,
                                            } = s;
                                            const fullKey = [...parent, key].join('.');
                                            const active = oldKeyToNew(value) === fullKey;
                                            let color = keyToValue(_value, bi.color);
                                            return (
                                                <li
                                                    key={fullKey}
                                                    data-active={active}
                                                    data-value={fullKey}
                                                    className={cls['color-square']}
                                                    title={comment}
                                                    style={{ background: color }}
                                                    onClick={handleChange}
                                                />
                                            );
                                        })}
                                    </ul>
                                </li>
                            );
                        })}
                    </ul>
                    <div onClick={goBIPanel} className={cls['link']}>
                        源色关系图谱
                    </div>
                </div>
            }>
            <div className={cls['color-chooser']}>
                <div className={cls['color-square']} style={{ background: color }} />
                <div className={cls['color-value']} hidden={!showValue} title={color}>
                    {color}
                </div>
            </div>
        </Pop>
    );
};

export default ColorChooser;
