import React, { useCallback, useMemo, useRef, useState } from 'react';

import cls from './index.module.scss';

import bi from '../dt/bi.json';
import dt from '../dt/dt.json';
import dtc from '../dt/dtc.json';
// import external from '../dt/external.json';
import EditContext from './EditContext';
import BIList from './BIList';
import BITokenEditor from './BITokenEditor';
import ComponentList from './ComponentList';
import TokenEditor from './TokenEditor';
import { clone, get } from './utils';

function App() {
    const [component, setComponent] = useState('button');
    const commonDesignTokens = useMemo(() => clone(dtc), []);
    const commonDesignTokensRef = useRef(commonDesignTokens);
    const componentDesignTokens = useMemo(() => clone(dt), []);
    const componentDesignTokensRef = useRef(componentDesignTokens);
    const [panel, setPanel] = useState('default');
    const [currentBI, setBI] = useState<string[]>(['base', 'environment']);

    const currentBIInfo = useMemo(() => {
        return get(bi.color, currentBI);
    }, [currentBI]);

    const handleCommonTokenChange = useCallback((target: string[], value: string) => {
        const to = get(commonDesignTokensRef.current, target);
        if (!to) return false;
        to.value = value;
        console.log(commonDesignTokensRef.current);
        return true;
    }, []);
    const handleComponentTokenChange = useCallback((target: string[], value: string) => {
        let to: any = componentDesignTokensRef.current;
        for (let i = 0; i < target.length; i++) {
            to = to[target[i]];
            if (!to) {
                console.error(`Can't change value for ${target}`);
                return false;
            }
        }
        if (to) to.value = value;
        return true;
    }, []);
    const handleComponentChange = useCallback((component: string) => {
        return setComponent(component);
    }, []);
    const handleBIChange = useCallback((bi: string[]) => {
        setBI(bi);
    }, []);
    const handleBack = useCallback(() => {
        setPanel('default');
    }, [setPanel]);
    const handleBIValueChange = useCallback((target: string[], value: string) => {
        console.log(target, value);
        return false;
    }, []);

    return (
        <EditContext.Provider
            value={{
                handleCommonTokenChange,
                handleComponentTokenChange,
                handleBIValueChange,
                setPanel,
                bi,
                dt: componentDesignTokensRef.current,
                dtc: commonDesignTokensRef.current,
            }}>
            <div className={cls['main']}>
                <div hidden={panel !== 'default'} className={cls['wrapper']}>
                    <div className={cls['left']}>
                        <ComponentList onChange={handleComponentChange} />
                    </div>
                    <div className={cls['right']}>
                        <TokenEditor
                            component={component}
                            commonDesignTokens={commonDesignTokens}
                        />
                    </div>
                </div>
                <div hidden={panel !== 'bi'}>
                    <button className={cls['back']} onClick={handleBack}>
                        {'<'}
                    </button>
                    <div className={cls['wrapper']}>
                        <div className={cls['left']}>
                            <BIList value={currentBI} onChange={handleBIChange} />
                        </div>
                        <div className={cls['right']}>
                            <BITokenEditor {...currentBIInfo} target={currentBI} />
                        </div>
                    </div>
                </div>
            </div>
        </EditContext.Provider>
    );
}

export default App;
