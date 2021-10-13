import React, { MouseEvent, useCallback } from 'react';

import cls from './index.module.scss';

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
                <div
                    data-component="button"
                    className={cls['edit-button']}
                    onClick={handleChange}>
                    查看组件元素
                </div>
            </div>
            <div className={cls['component-wrapper']}>
                <h2 className={cls['title']}>输入框 Input</h2>
                <div
                    data-component="input"
                    className={cls['edit-button']}
                    onClick={handleChange}>
                    查看组件元素
                </div>
            </div>
        </div>
    );
};

export default React.memo(ComponentList);
