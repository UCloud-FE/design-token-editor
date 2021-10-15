import React, { useCallback, useEffect, useState } from 'react';
import { RgbaColorPicker } from 'react-colorful';

import cls from './index.module.scss';

import { isValidColor, toRGBA, toStringColor } from '../utils/color';
import Pop from '../Pop';
import Input from './Input';
import Button from './Button';

const ColorInputWithoutMemo = ({
    value,
    onChange,
}: {
    value: string;
    onChange: (v: string) => void;
}) => {
    const [inputValue, setInputValue] = useState(value);
    const [isFocus, setIsFocus] = useState(false);
    const handleChange = useCallback((v: string) => {
        setInputValue(v);
    }, []);
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
            const v = e.target.value;
            if (isValidColor(v)) {
                onChange(v);
            } else {
                onChange('#fff');
            }
        },
        [onChange],
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
    const [color, setColor] = useState(value);
    const [visible, setVisible] = useState(false);
    const handleInputChange = useCallback((v) => {
        setColor(toStringColor(v));
    }, []);
    const handleColorChange = useCallback((v) => {
        setColor(toStringColor(v));
    }, []);
    const handleConfirm = useCallback(() => {
        onChange(color);
        setVisible(false);
    }, [color, onChange]);
    const rgba = toRGBA(color);

    return (
        <Pop
            visible={visible}
            onVisibleChange={setVisible}
            popup={
                <div className={cls['color-wrapper']}>
                    <div className={cls['picker-wrapper']}>
                        <RgbaColorPicker color={rgba} onChange={handleColorChange} />
                    </div>
                    <div className={cls['input-wrapper']}>
                        <ColorInput value={color} onChange={handleInputChange} />
                        <Button onClick={handleConfirm}>确定</Button>
                    </div>
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
