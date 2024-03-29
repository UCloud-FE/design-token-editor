import React, { useCallback, useContext, useRef, useState } from 'react';

import cls from './index.module.scss';

import Demo from '../Demo';
import EditContext from '../EditContext';
import Exporter, { PatchExporter } from '../Exporter';
import Export from '../Icons/Export';
import Import from '../Icons/Import';
import Importer, { ImporterRef } from '../Importer';
import Modal from '../Modal';
import SwitchTheme, { psgRemoveSwitchTheme } from '../SwitchTheme';
import TokenEditor from './TokenEditor';

const Main = () => {
    const [component, setComponent] = useState('button');
    const [outputModal, setOutputModal] = useState(false);
    const [patchModal, setPatchModal] = useState(false);
    const importerRef = useRef<ImporterRef>(null);

    const handleComponentChange = useCallback((component: string) => {
        return setComponent(component);
    }, []);
    const { handleImport } = useContext(EditContext);
    const exportTokens = useCallback(() => setOutputModal(true), []);
    const importTokens = useCallback(() => {
        importerRef.current?.trigger();
    }, []);
    const handleOutputModalClose = useCallback(() => setOutputModal(false), []);

    return (
        <>
            <div className={cls['header']}>
                <SwitchTheme />
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
                            <li onClick={exportTokens}>导出产物</li>
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
                    <Exporter />
                </Modal>
            )}
            {patchModal && (
                <Modal header="导出补丁" onClose={() => setPatchModal(false)}>
                    <PatchExporter />
                </Modal>
            )}
            <Importer
                ref={importerRef}
                onChange={(input, fileName) => {
                    handleImport(input, fileName);
                    psgRemoveSwitchTheme();
                }}
            />
        </>
    );
};

export default React.memo(Main);
