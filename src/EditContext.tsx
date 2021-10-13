import React from 'react';

import bi from '../dt/bi.json';
import dt from '../dt/dt.json';
import dtc from '../dt/dtc.json';

const EditContext = React.createContext<{
    handleCommonTokenChange: (target: string[], value: string) => boolean;
    handleComponentTokenChange: (target: string[], value: string) => boolean;
    handleBIValueChange: (target: string[], value: string) => boolean;
    setPanel: (panel: string) => void;
    bi: typeof bi;
    dt: typeof dt;
    dtc: typeof dtc;
}>({
    handleCommonTokenChange: () => false,
    handleComponentTokenChange: () => false,
    handleBIValueChange: () => false,
    setPanel: () => {},
    bi,
    dt,
    dtc,
});

export default EditContext;
