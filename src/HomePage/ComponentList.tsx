import React, { MouseEvent, useCallback } from 'react';

import cls from './index.module.scss';

import Eye from '../Icons/Eye';

const EditButtonWithoutMemo = ({
    component,
    onClick,
}: {
    component: string;
    onClick: (e: MouseEvent<HTMLDivElement>) => void;
}) => {
    return (
        <div data-component={component} className={cls['edit-button']} onClick={onClick}>
            <Eye />
            查看组件元素
        </div>
    );
};
const EditButton = React.memo(EditButtonWithoutMemo);

const ComponentList = ({ onChange }: { onChange: (component: string) => void }) => {
    const handleChange = useCallback(
        (e: MouseEvent<HTMLDivElement>) => {
            const dataset = e.currentTarget.dataset;
            const component = dataset['component'];
            component && onChange(component);
        },
        [onChange],
    );
    return (
        <div className={cls['component-list']}>
            <div className={cls['component-wrapper']}>
                <h2 className={cls['title']}>按钮 Button</h2>
                <EditButton component="button" onClick={handleChange} />
            </div>
            <div className={cls['component-wrapper']}>
                <h2 className={cls['title']}>输入框 Input</h2>
                <EditButton component="input" onClick={handleChange} />
            </div>
            <div className={cls['component-wrapper']}>
                <h2 className={cls['title']}>扩展 Tokens</h2>
                <EditButton component="external" onClick={handleChange} />
            </div>
        </div>
    );
};

export default React.memo(ComponentList);
