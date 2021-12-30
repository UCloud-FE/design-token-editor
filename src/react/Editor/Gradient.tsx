import React, { useCallback, useMemo, useContext, useRef, useEffect } from 'react';

import cls from './index.module.scss';

import { keyToValue, parseGradient, stringifyGradient } from '../utils';
import { IGradient } from '../interface';
import EditContext from '../EditContext';
import NumberInput from './NumberInput';
import ColorChooser from './ColorChooser';

const Gradient = ({
    value,
    onChange,
}: {
    value: string;
    onChange: (v: string) => void;
}) => {
    const { bi } = useContext(EditContext);
    const gradient = useMemo(() => parseGradient(value), [value]);
    const gradientRef = useRef(gradient);
    useEffect(() => {
        gradientRef.current = gradient;
    }, [gradient]);
    const handleGradientChange = useCallback(
        (key: keyof IGradient) => (v: string) => {
            const gradient = gradientRef.current;
            const newValue = { ...gradient };
            newValue[key] = v;
            onChange(stringifyGradient(newValue));
        },
        [onChange],
    );

    const handleStartChange = useMemo(
        () => handleGradientChange('start'),
        [handleGradientChange],
    );
    const handleEndChange = useMemo(
        () => handleGradientChange('end'),
        [handleGradientChange],
    );
    const handleAngleChange = useMemo(
        () => handleGradientChange('angle'),
        [handleGradientChange],
    );

    const { angle, start, end } = gradient;

    const gradientStr = keyToValue(stringifyGradient(gradient), bi);

    return (
        <div className={cls['gradient-wrapper']}>
            <ColorChooser value={start} onChange={handleStartChange} />
            <ColorChooser value={end} onChange={handleEndChange} />
            <NumberInput value={angle} onChange={handleAngleChange} />
            <div className={cls['gradient-square']} style={{ background: gradientStr }} />
        </div>
    );
};

export default React.memo(Gradient);
