import React, { useCallback, useMemo, useState } from 'react';

import { TokenType } from '../interface';
import { nameToTarget, trimKey } from '../utils';
import Color from './Color';
import ColorChooser from './ColorChooser';
import Input from './Input';
import Shadow from './Shadow';

const Editor = ({
    value: _value,
    name,
    onChange,
    type,
}: {
    value: string;
    name: string;
    onChange: (target: string[], v: string) => boolean;
    type?: TokenType;
}) => {
    const [value, setValue] = useState(_value);
    type = useMemo(() => {
        if (type) return type;
        const target = nameToTarget(name);
        if (target.includes('shadow')) return 'SHADOW';
        if (target.includes('color')) return 'COLOR';
        return 'INPUT';
    }, [name, type]);

    const handleChange = useCallback(
        (v: string) => {
            const target = nameToTarget(name);
            if (onChange(target, v)) {
                setValue(v);
            }
        },
        [name, onChange],
    );

    const handleColorChange = useCallback(
        (v: string) => {
            const target = nameToTarget(name);
            if (onChange(target, `{${v}}`)) {
                setValue(`{${v}}`);
            }
        },
        [name, onChange],
    );
    switch (type) {
        case 'COLOR':
            return <ColorChooser value={trimKey(value)} onChange={handleColorChange} />;
        case 'SHADOW':
            return <Shadow value={value} onChange={handleChange} />;
        case 'CUSTOM':
            return <Color value={value} onChange={handleChange} />;
        case 'INPUT':
        default:
            return <Input value={value} onChange={handleChange} />;
    }
};

export default React.memo(Editor);
