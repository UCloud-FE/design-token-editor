import React, {
    ChangeEvent,
    InputHTMLAttributes,
    useCallback,
    useEffect,
    useRef,
    useState,
} from 'react';

import { Override } from '../utils/type';
import cls from './index.module.scss';

const Input = ({
    value = '',
    onChange,
    ...rest
}: Override<
    InputHTMLAttributes<HTMLInputElement>,
    { value: string; onChange: (v: string) => void }
>) => {
    const [sValue, setSValue] = useState(value);
    const [focus, setFocus] = useState(false);
    const sValueRef = useRef(sValue);
    useEffect(() => {
        sValueRef.current = sValue;
    }, [sValue]);
    const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setSValue(e.target.value);
    }, []);
    const handleFocus = useCallback(() => {
        setFocus(true);
    }, []);
    const handleBlur = useCallback(() => {
        setFocus(false);
        const sValue = sValueRef.current;
        const finalValue = sValue.trim() ? sValue.trim() : '0';
        onChange(finalValue);
    }, []);
    useEffect(() => {
        if (!focus) {
            setSValue(value);
        }
    }, [value, focus]);
    return (
        <input
            {...rest}
            value={sValue}
            className={cls['number-input']}
            onBlur={handleBlur}
            onFocus={handleFocus}
            onChange={handleChange}
        />
    );
};

export default Input;
