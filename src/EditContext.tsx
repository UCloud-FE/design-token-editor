import React from 'react';

import tokens from '../dt/full.json';

const EditContext = React.createContext<{
    handleCommonTokenChange: (target: string[], value: string) => boolean;
    handleComponentTokenChange: (target: string[], value: string) => boolean;
    handleExternalTokenChange: (target: string[], value: string) => boolean;
    handleBIValueChange: (target: string[], value: string) => boolean;
    handleImport: (tk: typeof tokens) => void;
    setPanel: (panel: string) => void;
    origin: typeof tokens;
    bi: typeof tokens['builtin'];
    dt: typeof tokens['component'];
    dtc: typeof tokens['common'];
    external: typeof tokens['external'];
}>({
    handleCommonTokenChange: () => false,
    handleComponentTokenChange: () => false,
    handleExternalTokenChange: () => false,
    handleBIValueChange: () => false,
    handleImport: () => {},
    setPanel: () => {},
    origin: tokens,
    bi: tokens['builtin'],
    dt: tokens['component'],
    dtc: tokens['common'],
    external: tokens['external'],
});

export default EditContext;
