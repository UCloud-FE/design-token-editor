import React, { useCallback, useContext, useMemo, MouseEvent } from 'react';

import cls from './index.module.scss';

import {
    biToGroups,
    biKeyToValue,
    keyToValue,
    parseColorKey,
    stringifyColorKey,
} from '../utils';
import { isGradient, toRGBA } from '../utils/color';
import EditContext from '../EditContext';
import Pop from '../Pop';
import Alpha from './Alpha';
import Triangle from '../Icons/Triangle';

const ColorChooser = ({
    value,
    onChange,
    showValue = true,
}: {
    value: string;
    onChange: (v: string) => void;
    showValue?: boolean;
}) => {
    const { currentTokens, setPanel } = useContext(EditContext);
    const { key: colorKey, transparent: { alpha } = { alpha: 1 } } = useMemo(() => {
        return parseColorKey(value);
    }, [value]);
    const groups = useMemo(
        () => biToGroups(currentTokens.builtin),
        [currentTokens.builtin],
    );
    const handleChange = useCallback(
        (e: MouseEvent) => {
            const target = e.target as HTMLLIElement;
            const value = target.dataset['value'];
            if (!value) return;
            onChange(
                stringifyColorKey({
                    key: value,
                    transparent: {
                        alpha,
                    },
                }),
            );
        },
        [alpha, onChange],
    );
    const handleAlphaChange = useCallback(
        (v: number) => {
            onChange(
                stringifyColorKey({
                    key: colorKey,
                    transparent: {
                        alpha: v,
                    },
                }),
            );
        },
        [colorKey, onChange],
    );
    const goBIPanel = useCallback(() => {
        setPanel('bi');
    }, [setPanel]);
    const color = biKeyToValue(colorKey, currentTokens.builtin);
    const isGradientColor = isGradient(color);
    const result = biKeyToValue(value, currentTokens.builtin);

    return (
        <Pop
            popup={() => (
                <div className={cls['color-popup']}>
                    <ul className={cls['color-group-list']}>
                        {groups.map(({ group, info }) => {
                            return (
                                <li className={cls['group']} key={group}>
                                    <h2 className={cls['group-name']}>{group}</h2>
                                    <ul className={cls['color-list']}>
                                        {info.map((s) => {
                                            const {
                                                value: _value,
                                                comment,
                                                parent,
                                                key,
                                            } = s;
                                            const fullKey = [...parent, key].join('.');
                                            const active = colorKey === fullKey;
                                            let color = keyToValue(
                                                _value,
                                                currentTokens.builtin,
                                            );
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
                    {!isGradientColor && (
                        <div className={cls['transparent-wrapper']}>
                            <div className={cls['title']}>
                                <span>透明度调整:</span>
                                <span>{alpha}</span>
                            </div>
                            <Alpha
                                alpha={alpha}
                                onChange={handleAlphaChange}
                                color={toRGBA(color)}
                            />
                        </div>
                    )}
                    <div onClick={goBIPanel} className={cls['link']}>
                        源色关系图谱 <Triangle />
                    </div>
                </div>
            )}>
            <div className={cls['color-chooser']}>
                <div className={cls['color-square']} style={{ background: result }} />
                <div className={cls['color-value']} hidden={!showValue} title={result}>
                    {result}
                </div>
            </div>
        </Pop>
    );
};

export default React.memo(ColorChooser);
