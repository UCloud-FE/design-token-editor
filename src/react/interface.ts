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
    notAKey?: boolean;
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

export type ComponentTokenDefine = {
    _meta?: MetaDefine;
    [key: string]: TokenDefine | MetaDefine | ComponentTokenDefine | void;
};

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
    builtin?: ComponentTokenDefine;
    common?: ComponentTokenDefine;
    component?: ComponentTokenDefine;
    external?: ComponentTokenDefine;
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

export type HandleImportType = (fullToken: Tokens, fileName?: string) => Promise<void>;

export type ThemeMapType = Map<string, { label: string; value: any }>;
