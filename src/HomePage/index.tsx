import React, { useCallback, useContext, useState } from 'react';

import cls from './index.module.scss';

import EditContext from '../EditContext';
import ComponentList from './ComponentList';
import TokenEditor from './TokenEditor';

const HomePage = () => {
    const [component, setComponent] = useState('button');

    const handleComponentChange = useCallback((component: string) => {
        return setComponent(component);
    }, []);
    const { dtc } = useContext(EditContext);

    return (
        <div className={cls['wrapper']}>
            <div className={cls['left']}>
                <ComponentList onChange={handleComponentChange} />
            </div>
            <div className={cls['right']}>
                <TokenEditor component={component} commonDesignTokens={dtc} />
            </div>
        </div>
    );
};

export default React.memo(HomePage);
