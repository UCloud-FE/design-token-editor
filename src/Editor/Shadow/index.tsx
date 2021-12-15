import React, { useCallback, useMemo, useContext, useRef, useEffect } from 'react';

import cls from './index.module.scss';

import { keyToValue, parseShadows, stringifyShadows } from '../../utils';
import { IShadow } from '../../interface';
import EditContext from '../../EditContext';
import NumberInput from '../NumberInput';
import ColorChooser from '../ColorChooser';
import Add from '../../Icons/Add';
import Remove from '../../Icons/Remove';
import Switch from '../Switch';

const shadowOptions: [string, string] = ['outset', 'inset'];

const Shadow = ({
    value,
    onChange,
}: {
    value: string;
    onChange: (v: string) => void;
}) => {
    const { bi } = useContext(EditContext);
    const shadows: IShadow[] = useMemo(() => parseShadows(value), [value]);
    const shadowsRef = useRef(shadows);
    useEffect(() => {
        shadowsRef.current = shadows;
    }, [shadows]);
    const handleShadowChange = useCallback(
        (key: keyof IShadow) => (index: number) => (v: string) => {
            const shadows = shadowsRef.current;
            const newShadows = [...shadows];
            const newShadow = newShadows[index];
            newShadow[key] = v;
            onChange(stringifyShadows(newShadows));
        },
        [onChange],
    );

    const handleTypeChange = useMemo(
        () => handleShadowChange('type'),
        [handleShadowChange],
    );
    const handleColorChange = useMemo(
        () => handleShadowChange('color'),
        [handleShadowChange],
    );
    const handleOffsetXChange = useMemo(
        () => handleShadowChange('offsetX'),
        [handleShadowChange],
    );
    const handleOffsetYChange = useMemo(
        () => handleShadowChange('offsetY'),
        [handleShadowChange],
    );
    const handleBlurChange = useMemo(
        () => handleShadowChange('blur'),
        [handleShadowChange],
    );
    const handleSpreadChange = useMemo(
        () => handleShadowChange('spread'),
        [handleShadowChange],
    );
    const handleAdd = useCallback(
        (index: number) => () => {
            const shadows = shadowsRef.current;
            const newShadows = [...shadows];
            newShadows.splice(index + 1, 0, {
                type: 'outset',
                offsetX: '0',
                offsetY: '0',
                blur: '0',
                spread: '0',
                color: 'base.black',
            } as IShadow);
            onChange(stringifyShadows(newShadows));
        },
        [onChange],
    );
    const handleRemove = useCallback(
        (index: number) => () => {
            const shadows = shadowsRef.current;
            const newShadows = [...shadows];
            newShadows.splice(index, 1);
            onChange(stringifyShadows(newShadows));
        },
        [onChange],
    );

    const boxShadow = keyToValue(stringifyShadows(shadows), bi?.color);

    return (
        <div className={cls['shadow-wrapper']}>
            <div className={cls['shadow-list']}>
                <div className={cls['shadow-wrapper']}>
                    <div></div>
                    <div></div>
                    <div className={cls['shadow-input-tip']}>X</div>
                    <div className={cls['shadow-input-tip']}>Y</div>
                    <div className={cls['shadow-input-tip']}>模糊</div>
                    <div className={cls['shadow-input-tip']}>扩展</div>
                </div>
                {shadows.map((shadow, i) => {
                    const { type, offsetX, offsetY, blur, spread, color } = shadow;
                    return (
                        <div key={i} className={cls['shadow-wrapper']}>
                            <ColorChooser
                                value={color}
                                onChange={handleColorChange(i)}
                                showValue={false}
                            />
                            <Switch
                                value={type}
                                options={shadowOptions}
                                onChange={handleTypeChange(i)}
                            />
                            <NumberInput
                                value={offsetX}
                                onChange={handleOffsetXChange(i)}
                            />
                            <NumberInput
                                value={offsetY}
                                onChange={handleOffsetYChange(i)}
                            />
                            <NumberInput value={blur} onChange={handleBlurChange(i)} />
                            <NumberInput
                                value={spread}
                                onChange={handleSpreadChange(i)}
                            />
                            <Add onClick={handleAdd(i)} />
                            {shadows.length > 1 && <Remove onClick={handleRemove(i)} />}
                        </div>
                    );
                })}
            </div>
            <div className={cls['shadow-square']} style={{ boxShadow }} />
        </div>
    );
};

export default React.memo(Shadow);
