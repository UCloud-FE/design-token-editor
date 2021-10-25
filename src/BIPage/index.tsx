import React, { useCallback, useContext, useMemo, useState } from 'react';

import cls from './index.module.scss';

import { get, nameToTarget, targetToName } from '../utils';
import Button from '../Editor/Button';
import EditContext from '../EditContext';
import BIList from './BIList';
import BITokenEditor from './BITokenEditor';

const BIPage = ({ onBack }: { onBack: () => void }) => {
    const { bi } = useContext(EditContext);
    const [currentBI, setBI] = useState<string>('base,environment');
    const [update, setUpdate] = useState(0);
    const currentBIInfo = useMemo(() => {
        return get(bi.color, nameToTarget(currentBI));
    }, [bi.color, currentBI]);
    const handleBIChange = useCallback((bi: string[]) => {
        setBI(targetToName(bi));
    }, []);
    const handleValueChange = useCallback(() => {
        setUpdate((i) => i + 1);
    }, []);

    return (
        <>
            <div>
                <Button className={cls['back']} onClick={onBack}>
                    {'<'}
                </Button>
            </div>
            <div className={cls['wrapper']}>
                <div className={cls['left']}>
                    <BIList update={update} onChange={handleBIChange} />
                </div>
                <div className={cls['right']}>
                    <BITokenEditor
                        {...currentBIInfo}
                        target={currentBI}
                        // use key to force refresh
                        key={currentBI}
                        onChange={handleValueChange}
                    />
                </div>
            </div>
        </>
    );
};
export default React.memo(BIPage);
