import React, { useCallback, useMemo, useRef, useState } from 'react';

import cls from './index.module.scss';

import token from '../dt/full.json';
import { clone, get } from './utils';
import EditContext from './EditContext';
import BIPage from './BIPage';
import HomePage from './HomePage';

const { builtin: bi, common: dtc, component: dt, external } = token;

function App() {
    const commonDesignTokens = useMemo(() => clone(dtc), []);
    const commonDesignTokensRef = useRef(commonDesignTokens);
    const componentDesignTokens = useMemo(() => clone(dt), []);
    const componentDesignTokensRef = useRef(componentDesignTokens);
    const componentBuiltIn = useMemo(() => clone(bi), []);
    const componentBuiltInRef = useRef(componentBuiltIn);
    const externalTokens = useMemo(() => clone(external), []);
    const externalTokensRef = useRef(externalTokens);
    const [panel, setPanel] = useState('default');

    const handleCommonTokenChange = useCallback((target: string[], value: string) => {
        const to = get(commonDesignTokensRef.current, target);
        if (!to) {
            console.error(`Can't change value for ${target}`);
            return false;
        }
        to.value = value;
        console.log(target, value, to);
        return true;
    }, []);
    const handleComponentTokenChange = useCallback((target: string[], value: string) => {
        const to = get(componentDesignTokensRef.current, target);
        if (!to) {
            console.error(`Can't change value for ${target}`);
            return false;
        }
        to.value = value;
        console.log(target, value, to);
        return true;
    }, []);
    const handleExternalTokenChange = useCallback((target: string[], value: string) => {
        const to = get(externalTokensRef.current, target);
        if (!to) {
            console.error(`Can't change value for ${target}`);
            return false;
        }
        to.value = value;
        console.log(target, value, to);
        return true;
    }, []);
    const handleBIValueChange = useCallback((target: string[], value: string) => {
        const to = get(componentBuiltInRef.current.color, target);
        if (!to) {
            console.error(`Can't change value for ${target}`);
            return false;
        }
        to.value = value;
        console.log(target, value, to);
        return true;
    }, []);
    const handleBIBack = useCallback(() => {
        setPanel('default');
    }, [setPanel]);

    return (
        <EditContext.Provider
            value={{
                handleCommonTokenChange,
                handleComponentTokenChange,
                handleExternalTokenChange,
                handleBIValueChange,
                setPanel,
                origin: token,
                bi: componentBuiltInRef.current,
                dt: componentDesignTokensRef.current,
                dtc: commonDesignTokensRef.current,
                external: externalTokensRef.current,
            }}>
            <div className={cls['main']}>
                {panel === 'default' && <HomePage />}
                {panel === 'bi' && <BIPage onBack={handleBIBack} />}
            </div>
        </EditContext.Provider>
    );
}

export default App;
