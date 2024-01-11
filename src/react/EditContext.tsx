import React from 'react';
import defaultTokens from './defaultTokens';

import {
    ComponentDemos,
    OutputTokens,
    RenderComponentDemosWrap,
    ThemeMapType,
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
    originTokens: Tokens;
    currentTokens: Tokens;
    componentDemos?: ComponentDemos;
    renderComponentDemosWrap?: RenderComponentDemosWrap;
    outputTokens: OutputTokens;
    themeMap?: ThemeMapType;
}>({
    handleCommonTokenChange: () => false,
    handleComponentTokenChange: () => false,
    handleExternalTokenChange: () => false,
    handleBIValueChange: () => false,
    handleImport: () => {},
    fileName: 'design_tokens',
    setPanel: () => {},
    originTokens: defaultTokens,
    currentTokens: defaultTokens,
    outputTokens: {},
});

export default EditContext;
