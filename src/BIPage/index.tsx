import React, { useCallback, useContext, useMemo, useState } from 'react';

import cls from './index.module.scss';

import { get } from '../utils';
import Button from '../Editor/Button';
import EditContext from '../EditContext';
import BIList from './BIList';
import BITokenEditor from './BITokenEditor';

const BIPage = ({ onBack }: { onBack: () => void }) => {
    const { bi } = useContext(EditContext);
    const [currentBI, setBI] = useState<string[]>(['base', 'environment']);
    const currentBIInfo = useMemo(() => {
        console.log(currentBI, get(bi.color, currentBI));
        return get(bi.color, currentBI);
    }, [bi.color, currentBI]);
    const handleBIChange = useCallback((bi: string[]) => {
        setBI(bi);
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
                    <BIList value={currentBI} onChange={handleBIChange} />
                </div>
                <div className={cls['right']}>
                    <BITokenEditor
                        {...currentBIInfo}
                        target={currentBI}
                        key={currentBI.join('.')}
                    />
                </div>
            </div>
        </>
    );
};
export default BIPage;
