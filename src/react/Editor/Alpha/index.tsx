// copy from react-colorful
import React, { useEffect } from 'react';
import { RgbaColorPicker } from 'react-colorful';

import { RGBA } from '../../interface';
import { toStringColor } from '../../utils/color';
import { formatClassName } from './utils/format';
import { clamp } from './utils/clamp';
import { Interactive, Interaction } from './Interactive';
import Pointer from './Pointer';

interface Props {
    className?: string;
    alpha: number;
    color: RGBA;
    onChange: (alpha: number) => void;
}

const fixed = (n: number) => {
    return Math.round(n * 100) / 100;
};

let first = true;

const Alpha = ({ className, alpha, color, onChange }: Props): JSX.Element => {
    const handleMove = (interaction: Interaction) => {
        const newValue = fixed(interaction.left);
        if (alpha !== newValue) onChange(newValue);
    };

    const handleKey = (offset: Interaction) => {
        const newValue = fixed(clamp(alpha + offset.left));
        if (alpha !== newValue) onChange(newValue);
    };

    const colorFrom = toStringColor({ ...color, a: 0 });
    const colorTo = toStringColor({ ...color, a: 1 });

    const nodeClassName = formatClassName(['react-colorful__alpha', className]);

    useEffect(() => {
        if (!first) first = false;
    }, []);

    return (
        <div className={nodeClassName}>
            {first && (
                <div hidden>
                    <RgbaColorPicker />
                </div>
            )}
            <div
                className="react-colorful__alpha-gradient"
                style={{
                    backgroundImage: `linear-gradient(90deg, ${colorFrom}, ${colorTo})`,
                }}
            />
            <Interactive onMove={handleMove} onKey={handleKey}>
                <Pointer
                    className="react-colorful__alpha-pointer"
                    left={alpha}
                    color={toStringColor({ ...color, a: alpha })}
                />
            </Interactive>
        </div>
    );
};

export default React.memo(Alpha);
