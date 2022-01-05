import React, { useCallback, useContext, useMemo, useRef, useState } from 'react';

import cls from './index.module.scss';

import save from '../utils/save';
import Button from '../Editor/Button';
import EditContext from '../EditContext';
import { getPatch } from '../utils/patch';
import diff from '../utils/diff';
import { output, outputTokenMap } from '../utils';
import { OutputTokens } from '../interface';
import Modal from '../Modal';
import Importer, { ImporterRef } from '../Importer';

const DiffLocal = React.memo(function DiffLocal({
    localOutputTokens,
}: {
    localOutputTokens: OutputTokens;
}) {
    const { currentTokens } = useContext(EditContext);
    const currentOutputTokens = useMemo(() => output(currentTokens), [currentTokens]);
    const currentOutputTokensMap = useMemo(
        () => outputTokenMap(currentTokens),
        [currentTokens],
    );
    const diffs = useMemo(
        () => diff(localOutputTokens, currentOutputTokensMap),
        [currentOutputTokensMap, localOutputTokens],
    );

    return (
        <div className={cls['exporter']}>
            <ul>
                {diffs.map((diffInfo) => {
                    const { path, type, from, to } = diffInfo;
                    const key = path.join('.');
                    return type === 'CHANGE' ? (
                        <li key={key} className={cls['change']}>
                            <div className={cls['name']}>{key}</div>
                            <div className={cls['comment']}>
                                {currentOutputTokens[key]?.comment}
                            </div>
                            <div className={cls['diff']}>
                                <span className={cls['from']}>{from}</span>
                                <span>{'=>'}</span>
                                <span className={cls['to']}>{to}</span>
                            </div>
                        </li>
                    ) : type === 'ADD' ? (
                        <li key={key} className={cls['add']}>
                            <div className={cls['name']}>{key}</div>
                            <div className={cls['comment']}>
                                {currentOutputTokens[key]?.comment}
                            </div>
                            <div className={cls['diff']}>
                                <span className={cls['to']}>{to}</span>
                            </div>
                        </li>
                    ) : type === 'REMOVE' ? (
                        <li key={key} className={cls['remove']}>
                            <div className={cls['name']}>{key}</div>
                            <div className={cls['diff']}>
                                <span className={cls['from']}>{from}</span>
                            </div>
                        </li>
                    ) : null;
                })}
            </ul>
        </div>
    );
});

const Exporter = () => {
    const { currentTokens, originTokens, fileName } = useContext(EditContext);
    const currentOutputTokens = useMemo(() => output(currentTokens), [currentTokens]);
    const originOutputTokens = useMemo(() => output(originTokens), [originTokens]);
    const exportOutput = useCallback(() => {
        save(outputTokenMap(currentTokens), `${fileName}.json`);
        save(currentTokens, 'tokens.json');
    }, [currentTokens, fileName]);
    const [localOutputTokens, setLocalDiff] = useState<OutputTokens | null>(null);
    const handleModalClose = useCallback(() => setLocalDiff(null), []);
    const importerRef = useRef<ImporterRef>(null);
    const handleImportLocalFile = useCallback((content) => {
        setLocalDiff(content);
    }, []);
    const clickDiffLocal = useCallback(() => {
        importerRef.current?.trigger();
    }, []);
    return (
        <div className={cls['exporter']}>
            <Button onClick={exportOutput} className={cls['download']}>
                Download
            </Button>
            <Button onClick={clickDiffLocal} className={cls['diff']}>
                Diff Local
            </Button>
            <ul>
                {Object.keys(originOutputTokens).map((key) => {
                    const changed =
                        currentOutputTokens[key].value !== originOutputTokens[key].value;
                    return (
                        <li key={key} className={changed ? cls['change'] : ''}>
                            <span className={cls['name']}>{key}</span>
                            <span className={cls['comment']}>
                                {currentOutputTokens[key].comment}
                            </span>
                            <div className={cls['diff']}>
                                {changed && (
                                    <>
                                        <span className={cls['from']}>
                                            {originOutputTokens[key].value}
                                        </span>
                                        <span>{'=>'}</span>
                                    </>
                                )}
                                <span className={cls['to']}>
                                    {currentOutputTokens[key].value}
                                </span>
                            </div>
                        </li>
                    );
                })}
            </ul>

            <Importer ref={importerRef} onChange={handleImportLocalFile} />
            {localOutputTokens && (
                <Modal header="本地产物 DIFF" onClose={handleModalClose}>
                    <DiffLocal localOutputTokens={localOutputTokens} />
                </Modal>
            )}
        </div>
    );
};

const PatchExporter = React.memo(function PathExporter() {
    const { originTokens, currentTokens, fileName } = useContext(EditContext);
    const patch = getPatch(originTokens, currentTokens);
    const diffs = diff(originTokens, currentTokens);
    const exportPatch = useCallback(() => {
        save(patch, `${fileName}.json`);
    }, [fileName, patch]);
    return (
        <div className={cls['exporter-patch']}>
            <Button onClick={exportPatch} className={cls['download']}>
                Download
            </Button>
            <h2>修改点</h2>
            <ul>
                {diffs.map((diffInfo) => {
                    const { path, type, from, to } = diffInfo;
                    const key = path.join('.');
                    return type === 'CHANGE' ? (
                        <li key={key}>
                            <div className={cls['name']}>{key}</div>
                            <div className={cls['diff']}>
                                <span className={cls['from']}>{from}</span>
                                <span>{'=>'}</span>
                                <span className={cls['to']}>{to}</span>
                            </div>
                        </li>
                    ) : null;
                })}
            </ul>
        </div>
    );
});

export default React.memo(Exporter);

export { PatchExporter };
