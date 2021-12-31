import React, { useCallback, useContext, useRef, useState } from 'react';

import cls from './index.module.scss';

import { OutputTokens } from '../interface';
import { output } from '../utils';
import EditContext from '../EditContext';
import Modal from '../Modal';
import Exporter, { PatchExporter } from '../Exporter';
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
    const [patchModal, setPatchModal] = useState(false);
    const importerRef = useRef<ImporterRef>(null);

    const handleComponentChange = useCallback((component: string) => {
        return setComponent(component);
    }, []);
    const { originTokens, currentTokens, handleImport } = useContext(EditContext);
    const exportTokens = useCallback(() => {
        setOutputModal({
            output: output(currentTokens),
            origin: output(originTokens),
        });
    }, [currentTokens, originTokens]);
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
                <span className={cls['button']}>
                    <span>
                        <Export />
                        导出主题
                    </span>
                    <div className={cls['menu']}>
                        <ul>
                            <li onClick={exportTokens}>导出 tokens</li>
                            <li onClick={() => setPatchModal(true)}>导出补丁</li>
                        </ul>
                    </div>
                </span>
            </div>
            <div className={cls['wrapper']}>
                <div className={cls['left']}>
                    <Demo onChange={handleComponentChange} component={component} />
                </div>
                <div className={cls['right']}>
                    <TokenEditor component={component} />
                </div>
            </div>
            {outputModal && (
                <Modal header="导出 token" onClose={handleOutputModalClose}>
                    <Exporter {...outputModal} />
                </Modal>
            )}
            {patchModal && (
                <Modal header="导出补丁" onClose={() => setPatchModal(false)}>
                    <PatchExporter />
                </Modal>
            )}
            <Importer ref={importerRef} onChange={handleImport} />
        </>
    );
};

export default React.memo(Main);
