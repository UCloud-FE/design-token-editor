import Color from 'color';

interface RGBA {
    r: number;
    g: number;
    b: number;
    a?: number;
}

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
        return {
            r: 0,
            g: 0,
            b: 0,
            a: 1,
        };
    }
};

const padString = (s: string) => {
    return ('00' + s).substr(-2);
};

const c2s = (n: number) => {
    return padString(Math.min(255, n).toString(16));
};

const toStringColor = (color: string | RGBA): string => {
    if (typeof color === 'string') return color;
    if (color.a === 1 || !('a' in color)) {
        return `#${c2s(color.r)}${c2s(color.g)}${c2s(color.b)}`;
    }
    return `rgba(${color.r},${color.g},${color.b},${color.a})`;
};

const isValidColor = (color: string) => {
    try {
        Color(color);
        return true;
    } catch (e) {
        return false;
    }
};

export { isValidColor, toRGBA, toStringColor };
