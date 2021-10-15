import React, { ChangeEvent, InputHTMLAttributes, useCallback } from 'react';

import cls from './index.module.scss';

import { Override } from '../interface';

const Input = ({
    onChange,
    ...rest
}: Override<
    InputHTMLAttributes<HTMLInputElement>,
    { onChange: (v: string) => void }
>) => {
    const handleChange = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            onChange(e.target.value);
        },
        [onChange],
    );
    return <input {...rest} className={cls.input} onChange={handleChange} />;
};

export default React.memo(Input);
