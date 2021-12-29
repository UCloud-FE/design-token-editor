import React, { useCallback } from 'react';

import cls from './index.module.scss';

const Switch = ({
    options,
    value,
    onChange,
}: {
    options: [string, string];
    value: string;
    onChange: (v: string) => void;
}) => {
    const handleChange = useCallback(() => {
        const [newValue] = options.filter((v) => v !== value);
        onChange(newValue);
    }, [onChange, options, value]);
    return (
        <div className={cls['switch']} onClick={handleChange}>
            {value}
        </div>
    );
};

export default React.memo(Switch);
