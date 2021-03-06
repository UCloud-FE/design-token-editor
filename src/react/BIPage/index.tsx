import React, { useCallback, useContext, useMemo, useState } from 'react';

import cls from './index.module.scss';

import { get, nameToTarget, targetToName } from '../utils';
import Button from '../Editor/Button';
import EditContext from '../EditContext';
import BIList from './BIList';
import BITokenEditor from './BITokenEditor';
import Arrow from '../Icons/Arrow';

const BIPage = ({ onBack }: { onBack: () => void }) => {
    const { currentTokens } = useContext(EditContext);
    const [currentBI, setBI] = useState<string>('color,base,environment');
    const [update, setUpdate] = useState(0);
    const currentBIInfo = useMemo(() => {
        return get(currentTokens.builtin, nameToTarget(currentBI));
    }, [currentTokens.builtin, currentBI]);
    const handleBIChange = useCallback((bi: string[]) => {
        setBI(targetToName(bi));
    }, []);
    const handleValueChange = useCallback(() => {
        setUpdate((i) => i + 1);
    }, []);

    return (
        <>
            <div className={cls['breadcrumb']}>
                <Button className={cls['back']} onClick={onBack}>
                    <Arrow />
                </Button>
                <span onClick={onBack}>定制</span>
                <span>/</span>
                <span>原色关系图谱</span>
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
