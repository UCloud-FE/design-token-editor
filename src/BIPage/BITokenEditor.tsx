import React, { useCallback, useContext, useEffect, useState } from 'react';

import cls from './index.module.scss';

import EditContext from '../EditContext';
import Color from '../Editor/Color';
import Gradient from '../Editor/Gradient';

const BITokenEditor = ({
    comment,
    value,
    target,
    type,
}: {
    comment: string;
    value: string;
    target: string[];
    type?: string;
}) => {
    const [sValue, setSValue] = useState(value);
    const { handleBIValueChange } = useContext(EditContext);
    const handleChange = useCallback(
        (v: string) => {
            handleBIValueChange(target, v);
            setSValue(v);
        },
        [handleBIValueChange, target],
    );
    useEffect(() => {
        setSValue(value);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [target]);
    return (
        <div className={cls['bi-token-editor']}>
            <h2 className={cls['title']}>{comment}</h2>
            <div className={cls['divider']}></div>
            {type === 'gradient' ? (
                <Gradient value={sValue} onChange={handleChange} />
            ) : (
                <Color value={sValue} onChange={handleChange} />
            )}
            <h3 className={cls['sub-title']}>相关变量</h3>
            <div className={cls['divider']}></div>
        </div>
    );
};

export default React.memo(BITokenEditor);
