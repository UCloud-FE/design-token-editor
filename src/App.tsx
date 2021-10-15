import React, { useCallback, useMemo, useRef, useState } from 'react';

import cls from './index.module.scss';

import token from '../dt/full.json';
import { clone, get, output } from './utils';
import { OutputTokens } from './interface';
import Button from './Editor/Button';
import EditContext from './EditContext';
import Modal from './Modal';
import Exporter from './Exporter';
import Importer from './Importer';
import BIPage from './BIPage';
import HomePage from './HomePage';

const { builtin: bi, common: dtc, component: dt } = token;

function App() {
    const [outputModal, setOutputModal] = useState<{
        output: OutputTokens;
        origin: OutputTokens;
    } | null>(null);
    const [inputModal, setInputModal] = useState(false);
    const commonDesignTokens = useMemo(() => clone(dtc), []);
    const commonDesignTokensRef = useRef(commonDesignTokens);
    const componentDesignTokens = useMemo(() => clone(dt), []);
    const componentDesignTokensRef = useRef(componentDesignTokens);
    const componentBuiltIn = useMemo(() => clone(bi), []);
    const componentBuiltInRef = useRef(componentBuiltIn);
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
    const handleBIValueChange = useCallback((target: string[], value: string) => {
        return false;
    }, []);
    const handleBIBack = useCallback(() => {
        setPanel('default');
    }, [setPanel]);
    const exportTokens = useCallback(() => {
        setOutputModal({
            output: output(
                componentBuiltInRef.current,
                componentDesignTokensRef.current,
                commonDesignTokensRef.current,
            ),
            origin: output(bi, dt, dtc),
        });
    }, []);
    const importTokens = useCallback(() => {
        setInputModal(true);
    }, []);
    const handleOutputModalClose = useCallback(() => {
        setOutputModal(null);
    }, []);
    const handleInputModalClose = useCallback(() => {
        setInputModal(false);
    }, []);

    return (
        <EditContext.Provider
            value={{
                handleCommonTokenChange,
                handleComponentTokenChange,
                handleBIValueChange,
                setPanel,
                bi: componentBuiltInRef.current,
                dt: componentDesignTokensRef.current,
                dtc: commonDesignTokensRef.current,
            }}>
            <div className={cls['main']}>
                <div hidden={panel !== 'default'}>
                    <div>
                        <Button onClick={exportTokens}>export</Button>
                        <Button onClick={importTokens}>import</Button>
                    </div>
                    <HomePage />
                </div>
                <div hidden={panel !== 'bi'}>
                    <BIPage onBack={handleBIBack} />
                </div>
                {outputModal && (
                    <Modal header={'EXPORT TOKENS'} onClose={handleOutputModalClose}>
                        <Exporter {...outputModal} />
                    </Modal>
                )}
                {inputModal && (
                    <Modal header={'INPUT TOKENS'} onClose={handleInputModalClose}>
                        <Importer onInput={console.log} />
                    </Modal>
                )}
            </div>
        </EditContext.Provider>
    );
}

export default App;
