import React, { ChangeEvent, InputHTMLAttributes, useCallback } from 'react';

import { Override } from '../utils/type';

import cls from './index.module.scss';

const Input = ({
    onChange,
    ...rest
}: Override<
    InputHTMLAttributes<HTMLInputElement>,
    { onChange: (v: string) => void }
>) => {
    const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value);
    }, []);
    return <input {...rest} className={cls['number-input']} onChange={handleChange} />;
};

export default Input;
