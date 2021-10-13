import React, { useCallback, useEffect, useState } from 'react';
import { RgbaColorPicker } from 'react-colorful';

import { isValidColor, toRGBA, toStringColor } from '../utils/color';
import Pop from '../Pop';
import cls from './index.module.scss';
import Input from './Input';

const ColorInputWithoutMemo = ({
    value,
    onChange,
}: {
    value: string;
    onChange: (v: string) => void;
}) => {
    const [inputValue, setInputValue] = useState(value);
    const [isFocus, setIsFocus] = useState(false);
    const handleChange = useCallback(
        (e) => {
            let v = e.target.value;
            if (isValidColor(v)) {
                onChange(v);
            } else {
                onChange('#fff');
            }
            setInputValue(v);
        },
        [onChange],
    );
    useEffect(() => {
        if (!isFocus) {
            setInputValue(value);
        }
    }, [isFocus, value]);
    const handleFocus = useCallback(() => {
        setIsFocus(true);
    }, []);
    const handleBlur = useCallback(
        (e) => {
            setIsFocus(false);
            handleChange(e);
        },
        [handleChange],
    );
    return (
        <Input
            value={inputValue}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={handleChange}
        />
    );
};
const ColorInput = React.memo(ColorInputWithoutMemo);

const Color = ({ value, onChange }: { value: string; onChange: (v: string) => void }) => {
    const handleInputChange = useCallback(
        (v) => {
            onChange(v);
        },
        [onChange],
    );
    const handleColorChange = useCallback(
        (v) => {
            return onChange(toStringColor(v));
        },
        [onChange],
    );
    const rgba = toRGBA(value);

    return (
        <Pop
            popup={
                <div>
                    <RgbaColorPicker color={rgba} onChange={handleColorChange} />
                    <ColorInput value={value} onChange={handleInputChange} />
                </div>
            }>
            <div className={cls['color-picker']}>
                <div className={cls['color-square']} style={{ background: value }} />
                <div className={cls['color-value']} title={value}>
                    {value}
                </div>
            </div>
        </Pop>
    );
};

export default React.memo(Color);
