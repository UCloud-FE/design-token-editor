import React from 'react';
import defaultTokens from './defaultTokens';

import {
    ComponentDemos,
    OutputTokens,
    RenderComponentDemosWrap,
    Tokens,
} from './interface';

const EditContext = React.createContext<{
    handleCommonTokenChange: (target: string[], value: string) => boolean;
    handleComponentTokenChange: (target: string[], value: string) => boolean;
    handleExternalTokenChange: (target: string[], value: string) => boolean;
    handleBIValueChange: (target: string[], value: string) => boolean;
    handleImport: (tk: Tokens, fileName: string) => void;
    fileName: string;
    setPanel: (panel: string) => void;
    origin: Tokens;
    bi: Tokens['builtin'];
    dt: Tokens['component'];
    dtc: Tokens['common'];
    external: Tokens['external'];
    componentDemos?: ComponentDemos;
    renderComponentDemosWrap?: RenderComponentDemosWrap;
    outputTokens: OutputTokens;
}>({
    handleCommonTokenChange: () => false,
    handleComponentTokenChange: () => false,
    handleExternalTokenChange: () => false,
    handleBIValueChange: () => false,
    handleImport: () => {},
    fileName: 'design_tokens',
    setPanel: () => {},
    origin: defaultTokens,
    bi: defaultTokens['builtin'],
    dt: defaultTokens['component'],
    dtc: defaultTokens['common'],
    external: defaultTokens['external'],
    outputTokens: {},
});

export default EditContext;
