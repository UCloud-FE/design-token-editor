import React, { useCallback } from 'react';

import cls from './index.module.scss';

import { OutputTokens } from '../interface';
import save from '../utils/save';
import Button from '../Editor/Button';

const Exporter = ({ output, origin }: { output: OutputTokens; origin: OutputTokens }) => {
    const exportOutput = useCallback(() => {
        save(output, 'output.json');
    }, [output]);
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
                                <span className={cls['value']}>{output[key]}</span>
                                {changed && (
                                    <span className={cls['origin']}>{origin[key]}</span>
                                )}
                            </div>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default React.memo(Exporter);
