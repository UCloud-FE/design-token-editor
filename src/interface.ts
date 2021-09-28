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
