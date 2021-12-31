import React, { useCallback, useContext } from 'react';

import cls from './index.module.scss';

import { OutputTokens } from '../interface';
import save from '../utils/save';
import Button from '../Editor/Button';
import EditContext from '../EditContext';
import { getPatch } from '../utils/patch';
import diff from '../utils/diff';

const Exporter = ({ output, origin }: { output: OutputTokens; origin: OutputTokens }) => {
    const { currentTokens, fileName } = useContext(EditContext);
    const exportOutput = useCallback(() => {
        save(output, `${fileName}.json`);
        save(currentTokens, 'tokens.json');
    }, [currentTokens, fileName, output]);
    return (
        <div className={cls['exporter']}>
            <Button onClick={exportOutput} className={cls['download']}>
                Download
            </Button>
            <ul>
                {Object.keys(origin).map((key) => {
                    const changed = output[key] !== origin[key];
                    return (
                        <li key={key} className={changed ? cls['changed'] : ''}>
                            <span className={cls['name']}>{key}:</span>
                            <div className={cls['diff']}>
                                {changed && (
                                    <>
                                        <span className={cls['from']}>{origin[key]}</span>
                                        <span>{'=>'}</span>
                                    </>
                                )}
                                <span className={cls['to']}>{output[key]}</span>
                            </div>
                        </li>
                    );
                })}
            </ul>
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
                            <div className="name">{key}</div>
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
