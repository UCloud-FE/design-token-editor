// utils for color transform
import * as Color from 'color';

import { RGBA } from '../interface';

const toRGBA = (color: string) => {
    try {
        const rgbColor = Color(color).rgb().object();
        return {
            r: rgbColor.r,
            g: rgbColor.g,
            b: rgbColor.b,
            a: rgbColor.alpha === undefined ? 1 : rgbColor.alpha,
        };
    } catch (error) {
        console.error(error);

        return {
            r: 0,
            g: 0,
            b: 0,
            a: 1,
        };
    }
};
const transparent = (color: string, transparent: number) => {
    const rgba = toRGBA(color);
    rgba.a = transparent / 100;
    return toStringColor(rgba);
};

const padString = (s: string) => {
    return ('00' + s).substr(-2);
};

const c2s = (n: number) => {
    return padString(Math.min(255, n).toString(16));
};

const toStringColor = (color: string | RGBA): string => {
    if (typeof color === 'string') {
        color = toRGBA(color);
    }
    if (color.a === 1 || color.a == null) {
        return `#${c2s(color.r)}${c2s(color.g)}${c2s(color.b)}`;
    }
    return `rgba(${color.r},${color.g},${color.b},${+(+color.a).toFixed(2)})`;
};

const isValidColor = (color: string) => {
    try {
        Color(color);
        return true;
    } catch (e) {
        return false;
    }
};

const isGradient = (color: string) => {
    return /^linear-gradient\(/.test(color);
};

export { isValidColor, toRGBA, toStringColor, transparent, isGradient };
