import React, { useMemo, useContext, useCallback } from 'react';

import cls from './index.module.scss';

import { biToGroups, keyToValue, nameToTarget, targetToName } from '../utils';
import EditContext from '../EditContext';

const BIList = ({
    update,
    onChange,
}: {
    update: number;
    onChange: (value: string[]) => void;
}) => {
    const { currentTokens } = useContext(EditContext);
    /** use update to force update */
    const groups = useMemo(
        () => biToGroups(currentTokens.builtin),
        [currentTokens.builtin, update],
    );
    const handleColorChange = useCallback(
        (e) => {
            const dataset = (e.target as HTMLElement).dataset;
            if (dataset.value) {
                onChange(nameToTarget(dataset.value));
            }
        },
        [onChange],
    );

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
                                    let color = keyToValue(_value, currentTokens.builtin);
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
