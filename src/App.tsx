import React, { useCallback, useState } from 'react';

import cls from './index.module.scss';

import token from '../dt/full.json';
import { clone, get, merge, sleep, output } from './utils';
import EditContext from './EditContext';
import BIPage from './BIPage';
import HomePage from './HomePage';
import useRefState from './hooks/useRefState';

const Loading = ({ loading }: { loading: boolean }) => {
    return (
        <div className={cls['loading']} hidden={!loading}>
            <div>
                <svg className={cls['indicator']} viewBox="0 0 24 24">
                    <path d="M12 2a1 1 0 010 2.09A7.91 7.91 0 1019.91 12 1 1 0 0122 12 10 10 0 1112 2z"></path>
                </svg>
            </div>
            <div>导入中</div>
        </div>
    );
};

function App({ onChange }: { onChange?: (tokens: { [key: string]: string }) => void }) {
    // use key to force control render
    const [key, setKey] = useState(0);
    const [fileName, setFileName] = useState('design_tokens');
    const [loading, setLoading] = useState(false);
    const [fullToken, setFullToken] = useState(token);
    const [currentFullToken, setCurrentFullToken, currentFullTokenRef] = useRefState(() =>
        clone(fullToken),
    );
    const [panel, setPanel] = useState('default');

    const handleChange = useCallback(() => {
        if (!onChange) return;
        const bi = currentFullTokenRef.current.builtin;
        const dt = currentFullTokenRef.current.component;
        const dtc = currentFullTokenRef.current.common;
        const external = currentFullTokenRef.current.external;
        const tokens = output(bi, dtc, dt, external);
        onChange(tokens);
    }, [currentFullTokenRef, onChange]);

    const handleImport = useCallback(
        async (fullToken: typeof token, fileName: string) => {
            setLoading(true);
            await sleep(1);
            fullToken = merge(token, fullToken);
            setFullToken(fullToken);
            setCurrentFullToken(clone(fullToken));
            setKey((key) => key + 1);
            setFileName(fileName);
            await sleep(1);
            setLoading(false);
            handleChange();
        },
        [handleChange, setCurrentFullToken],
    );

    const handleCommonTokenChange = useCallback(
        (target: string[], value: string) => {
            const to = get(currentFullTokenRef.current.common, target);
            if (!to) {
                console.error(`Can't change value for ${target}`);
                return false;
            }
            to.value = value;
            handleChange();
            return true;
        },
        [currentFullTokenRef, handleChange],
    );
    const handleComponentTokenChange = useCallback(
        (target: string[], value: string) => {
            const to = get(currentFullTokenRef.current.component, target);
            if (!to) {
                console.error(`Can't change value for ${target}`);
                return false;
            }
            to.value = value;
            handleChange();
            return true;
        },
        [currentFullTokenRef, handleChange],
    );
    const handleExternalTokenChange = useCallback(
        (target: string[], value: string) => {
            const to = get(currentFullTokenRef.current.external, target);
            if (!to) {
                console.error(`Can't change value for ${target}`);
                return false;
            }
            to.value = value;
            handleChange();
            return true;
        },
        [currentFullTokenRef, handleChange],
    );
    const handleBIValueChange = useCallback(
        (target: string[], value: string) => {
            const to = get(currentFullTokenRef.current.builtin.color, target);
            if (!to) {
                console.error(`Can't change value for ${target}`);
                return false;
            }
            to.value = value;
            handleChange();
            return true;
        },
        [currentFullTokenRef, handleChange],
    );
    const handleBIBack = useCallback(() => {
        setPanel('default');
    }, [setPanel]);

    return (
        <div>
            <Loading loading={loading} />
            <EditContext.Provider
                key={key}
                value={{
                    handleCommonTokenChange,
                    handleComponentTokenChange,
                    handleExternalTokenChange,
                    handleBIValueChange,
                    fileName,
                    handleImport,
                    setPanel,
                    origin: fullToken,
                    bi: currentFullToken.builtin,
                    dt: currentFullToken.component,
                    dtc: currentFullToken.common,
                    external: currentFullToken.external,
                }}>
                <div className={cls['main']}>
                    {panel === 'default' && <HomePage />}
                    {panel === 'bi' && <BIPage onBack={handleBIBack} />}
                </div>
            </EditContext.Provider>
        </div>
    );
}

export default App;
