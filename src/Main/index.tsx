import React, { useCallback, useContext, useRef, useState } from 'react';

import cls from './index.module.scss';

import { OutputTokens } from '../interface';
import { output } from '../utils';
import EditContext from '../EditContext';
import Modal from '../Modal';
import Exporter from '../Exporter';
import Importer, { ImporterRef } from '../Importer';
import Demo from '../Demo';
import TokenEditor from './TokenEditor';
import Import from '../Icons/Import';
import Export from '../Icons/Export';

const Main = () => {
    const [component, setComponent] = useState('button');
    const [outputModal, setOutputModal] = useState<{
        output: OutputTokens;
        origin: OutputTokens;
    } | null>(null);
    const importerRef = useRef<ImporterRef>(null);

    const handleComponentChange = useCallback((component: string) => {
        return setComponent(component);
    }, []);
    const { bi, dt, dtc, external, origin, handleImport } = useContext(EditContext);
    const exportTokens = useCallback(() => {
        setOutputModal({
            output: output(bi, dt, dtc, external),
            origin: output(
                origin.builtin,
                origin.component,
                origin.common,
                origin.external,
            ),
        });
    }, [
        bi,
        dt,
        dtc,
        external,
        origin.builtin,
        origin.common,
        origin.component,
        origin.external,
    ]);
    const importTokens = useCallback(() => {
        importerRef.current?.trigger();
    }, []);
    const handleOutputModalClose = useCallback(() => {
        setOutputModal(null);
    }, []);

    return (
        <>
            <div className={cls['header']}>
                <span onClick={importTokens} className={cls['button']}>
                    <Import />
                    导入主题
                </span>
                <span onClick={exportTokens} className={cls['button']}>
                    <Export />
                    导出主题
                </span>
            </div>
            <div className={cls['wrapper']}>
                <div className={cls['left']}>
                    <Demo onChange={handleComponentChange} />
                </div>
                <div className={cls['right']}>
                    <TokenEditor component={component} />
                </div>
            </div>
            {outputModal && (
                <Modal header={'EXPORT TOKENS'} onClose={handleOutputModalClose}>
                    <Exporter {...outputModal} />
                </Modal>
            )}
            <Importer ref={importerRef} onChange={handleImport} />
        </>
    );
};

export default React.memo(Main);
