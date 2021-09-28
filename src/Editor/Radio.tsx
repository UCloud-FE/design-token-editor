import React, { useCallback, MouseEvent } from 'react';

import cls from './index.module.scss';

const Radio = ({
    value,
    options,
    onChange,
}: {
    value: string;
    options: string[];
    onChange: (v: string) => void;
}) => {
    const handleChange = useCallback((e: MouseEvent) => {
        const target = e.target as HTMLDivElement;
        const option = target.dataset['option'];
        option && onChange(option);
    }, []);
    return (
        <div className={cls['radio-group']}>
            {options.map((option) => {
                return (
                    <div
                        key={option}
                        data-active={option === value}
                        data-option={option}
                        className={cls['radio-option']}
                        onClick={handleChange}
                    >
                        {option}
                    </div>
                );
            })}
        </div>
    );
};

export default Radio;
