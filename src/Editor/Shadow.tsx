import React, { useMemo } from 'react';

import NumberInput from './NumberInput';
import Input from './Input';
import ColorChooser from './ColorChooser';
import Radio from './Radio';
import cls from './index.module.scss';

const shadowOptions = ['outset', 'inset'];
const Shadow = ({ value }: { value: string }) => {
    const shadows: string[][] = useMemo(() => {
        let str = value.trim();
        const shadows = str.match(/(?:.*?(?:\{.*?\})?,)|(?:.+$)/g) || [];
        return shadows.map((str) => {
            str = str.trim().replace(/,$/, '');
            const tokens = (str.match(/(\{.+\})|([^\s]+?\s)/g) || []).map((token) =>
                token.trim(),
            );
            if (tokens.length < 6) {
                tokens.unshift('outset');
            }
            return tokens;
        });
    }, []);
    const shadow = shadows[0];

    const [type, offsetX, offsetY, blur, spread, color] = shadow;

    return (
        <div className={cls['shadow-wrapper']}>
            <Radio value={type} options={shadowOptions} onChange={console.log} />
            <ColorChooser value={color} onChange={console.log} showValue={false} />
            <NumberInput value={offsetX} onChange={console.log} />
            <NumberInput value={offsetY} onChange={console.log} />
            <NumberInput value={blur} onChange={console.log} />
            <NumberInput value={spread} onChange={console.log} />
        </div>
    );
};

export default Shadow;
