export interface BIToken {
    value: string;
    comment: string;
    parent: string[];
    key: string;
}

export interface BITokenGroup {
    group: string;
    info: BIToken[];
}

export type TokenType = 'COLOR' | 'SHADOW' | 'INPUT';

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
    _meta: MetaDefine;
    [key: string]: TokenDefine | MetaDefine | ComponentTokensDefine;
}
export interface Token {
    value: string;
    comment: string;
    type?: TokenType;
    target: string[];
}
