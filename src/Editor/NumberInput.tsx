import React, {
    ChangeEvent,
    FocusEventHandler,
    InputHTMLAttributes,
    SyntheticEvent,
    useCallback,
    useEffect,
    useRef,
    useState,
} from 'react';

import cls from './index.module.scss';

import { Override } from '../interface';

const NumberInput = ({
    value = '',
    onChange,
    ...rest
}: Override<
    InputHTMLAttributes<HTMLInputElement>,
    { value: string; onChange: (v: string, e: SyntheticEvent<HTMLInputElement>) => void }
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
    const handleBlur: FocusEventHandler<HTMLInputElement> = useCallback(
        (e) => {
            setFocus(false);
            const sValue = sValueRef.current;
            const finalValue = sValue.trim() ? sValue.trim() : '0';
            onChange(finalValue, e);
        },
        [onChange],
    );
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

export default React.memo(NumberInput);
