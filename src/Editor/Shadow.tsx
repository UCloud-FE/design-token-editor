import React, { useCallback, useMemo, useContext, useRef, useEffect } from 'react';

import cls from './index.module.scss';

import { keyToValue, parseShadows, stringifyShadows } from '../utils';
import { IShadow } from '../interface';
import EditContext from '../EditContext';
import NumberInput from './NumberInput';
import ColorChooser from './ColorChooser';
import Radio from './Radio';

const shadowOptions = ['outset', 'inset'];

const Shadow = ({
    value,
    onChange,
}: {
    value: string;
    onChange: (v: string) => void;
}) => {
    const { bi } = useContext(EditContext);
    const shadows: IShadow[] = useMemo(() => parseShadows(value), [value]);
    const shadow = shadows[0];
    const shadowRef = useRef(shadow);
    useEffect(() => {
        shadowRef.current = shadow;
        console.log(shadow);
    }, [shadow]);
    const handleShadowChange = useCallback(
        (key: keyof IShadow) => (v: string) => {
            const shadow = shadowRef.current;
            const newValue = { ...shadow };
            newValue[key] = v;
            console.log(stringifyShadows([newValue]));
            onChange(stringifyShadows([newValue]));
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

    const { type, offsetX, offsetY, blur, spread, color } = shadow;
    console.log(shadow);

    const boxShadow = keyToValue(stringifyShadows(shadows), bi.color);

    return (
        <div className={cls['shadow-wrapper']}>
            <ColorChooser value={color} onChange={handleColorChange} showValue={false} />
            <Radio value={type} options={shadowOptions} onChange={handleTypeChange} />
            <div className={cls['shadow-input']}>
                <NumberInput value={offsetX} onChange={handleOffsetXChange} />
                <div className={cls['shadow-input-tip']}>X</div>
            </div>
            <div className={cls['shadow-input']}>
                <NumberInput value={offsetY} onChange={handleOffsetYChange} />
                <div className={cls['shadow-input-tip']}>Y</div>
            </div>
            <div className={cls['shadow-input']}>
                <NumberInput value={blur} onChange={handleBlurChange} />
                <div className={cls['shadow-input-tip']}>模糊</div>
            </div>
            <div className={cls['shadow-input']}>
                <NumberInput value={spread} onChange={handleSpreadChange} />
                <div className={cls['shadow-input-tip']}>扩展</div>
            </div>
            <div className={cls['shadow-square']} style={{ boxShadow }} />
        </div>
    );
};

export default React.memo(Shadow);
