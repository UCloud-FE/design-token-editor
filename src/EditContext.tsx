import React from 'react';

import tokens from '../dt/full.json';

const EditContext = React.createContext<{
    handleCommonTokenChange: (target: string[], value: string) => boolean;
    handleComponentTokenChange: (target: string[], value: string) => boolean;
    handleBIValueChange: (target: string[], value: string) => boolean;
    setPanel: (panel: string) => void;
    origin: typeof tokens;
    bi: typeof tokens['builtin'];
    dt: typeof tokens['component'];
    dtc: typeof tokens['common'];
}>({
    handleCommonTokenChange: () => false,
    handleComponentTokenChange: () => false,
    handleBIValueChange: () => false,
    setPanel: () => {},
    origin: tokens,
    bi: tokens['builtin'],
    dt: tokens['component'],
    dtc: tokens['common'],
});

export default EditContext;
