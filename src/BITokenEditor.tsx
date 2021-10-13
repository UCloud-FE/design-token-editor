import React, { useCallback, useContext, useState } from 'react';

import EditContext from './EditContext';
import Color from './Editor/Color';
import cls from './index.module.scss';

const BITokenEditor = ({
    comment,
    value,
    target,
}: {
    comment: string;
    value: string;
    target: string[];
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
    return (
        <div className={cls['bi-token-editor']}>
            <h2 className={cls['title']}>{comment}</h2>
            <div className={cls['divider']}></div>
            <Color value={sValue} onChange={handleChange} />
            <h3 className={cls['sub-title']}>相关变量</h3>
            <div className={cls['divider']}></div>
        </div>
    );
};

export default React.memo(BITokenEditor);
