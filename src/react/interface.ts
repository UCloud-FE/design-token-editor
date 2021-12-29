import { ReactNode } from 'react';

export type Override<T1, T2> = Omit<T1, keyof T2> & T2;

export interface RGBA {
    r: number;
    g: number;
    b: number;
    a?: number;
}

export interface ColorInfo {
    key: string;
    transparent?: {
        alpha: number;
    };
}

export interface BIToken {
    value: string;
    comment: string;
    parent: string[];
    key: string;
    type?: string;
}

export interface BITokenGroup {
    group: string;
    info: BIToken[];
}

export type TokenType = 'COLOR' | 'SHADOW' | 'INPUT' | 'CUSTOM';

export interface TokenDefine {
    value: string;
    comment: string;
    type?: TokenType;
    deprecated?: boolean;
}

export interface MetaDefine {
    group?: string;
}

export interface ComponentTokensDefine {
    _meta?: MetaDefine;
    [key: string]: TokenDefine | MetaDefine | ComponentTokensDefine | void;
}

export interface Token {
    value: string;
    comment: string;
    type?: TokenType;
    target: string[];
}

export interface OutputTokens {
    [key: string]: string;
}

export interface IShadow {
    type: string;
    offsetX: string;
    offsetY: string;
    blur: string;
    spread: string;
    color: string;
}

export interface IGradient {
    angle: string;
    start: string;
    end: string;
}

export interface Tokens {
    builtin?: {
        color: ComponentTokensDefine;
        [key: string]: ComponentTokensDefine;
    };
    common?: {
        [key: string]: ComponentTokensDefine;
    };
    component?: {
        [key: string]: ComponentTokensDefine;
    };
    external?: {
        [key: string]: ComponentTokensDefine;
    };
}

export type RenderComponentDemosWrap = (props: {
    tokens: OutputTokens;
    children: ReactNode;
}) => ReactNode;

export type ComponentDemos = {
    component: string;
    title: string;
    demo: ReactNode;
}[];
