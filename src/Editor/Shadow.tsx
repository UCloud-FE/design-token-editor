import React, { useCallback, useMemo, useContext, useRef, useEffect } from 'react';

import NumberInput from './NumberInput';
import ColorChooser from './ColorChooser';
import Radio from './Radio';
import cls from './index.module.scss';
import { shadowsToBoxShadow, shadowTokenToShadows } from '../utils';
import EditContext from '../EditContext';

const shadowOptions = ['outset', 'inset'];
const Shadow = ({
    value,
    onChange,
}: {
    value: string;
    onChange: (v: string) => void;
}) => {
    const { bi } = useContext(EditContext);
    const shadows: string[][] = useMemo(() => shadowTokenToShadows(value), [value]);
    const shadow = shadows[0];
    const shadowRef = useRef(shadow);
    useEffect(() => {
        shadowRef.current = shadow;
    }, [shadow]);
    const sharedHandleChange = useCallback(
        (v: string[]) => {
            if (v[0] === 'outset') {
                v.shift();
            }
            onChange(v.join(' '));
        },
        [onChange],
    );
    const handleTypeChange = useCallback(
        (type: string) => {
            const shadow = shadowRef.current;
            const newValue = [...shadow];
            newValue[0] = type;
            sharedHandleChange(newValue);
        },
        [sharedHandleChange],
    );
    const handleColorChange = useCallback(
        (color: string) => {
            const shadow = shadowRef.current;
            const newValue = [...shadow];
            newValue[5] = color;
            sharedHandleChange(newValue);
        },
        [sharedHandleChange],
    );
    const handleNumberChange = useCallback(
        (index: number) => (v: string) => {
            const shadow = shadowRef.current;
            const newValue = [...shadow];
            newValue[index] = v;
            sharedHandleChange(newValue);
        },
        [sharedHandleChange],
    );

    const handleOffsetXChange = useMemo(
        () => handleNumberChange(1),
        [handleNumberChange],
    );
    const handleOffsetYChange = useMemo(
        () => handleNumberChange(2),
        [handleNumberChange],
    );
    const handleBlurChange = useMemo(() => handleNumberChange(3), [handleNumberChange]);
    const handleSpreadChange = useMemo(() => handleNumberChange(4), [handleNumberChange]);

    const [type, offsetX, offsetY, blur, spread, color] = shadow;
    const boxShadow = shadowsToBoxShadow(shadows, bi.color);

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

export default Shadow;
