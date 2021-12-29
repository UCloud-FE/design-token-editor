import React, { MouseEvent, ReactNode, useCallback, useContext } from 'react';

import Eye from '../Icons/Eye';
import cls from './index.module.scss';
import DemoContext from './DemoContext';

const EditButtonWithoutMemo = ({
    onClick,
}: {
    onClick: (e: MouseEvent<HTMLDivElement>) => void;
}) => {
    return (
        <div className={cls['edit-button']} onClick={onClick}>
            <Eye />
            查看组件元素
        </div>
    );
};
const EditButton = React.memo(EditButtonWithoutMemo);

const DemoWrap = ({
    component,
    title,
    children,
    current,
}: {
    component: string;
    title?: ReactNode;
    children: ReactNode;
    current?: boolean;
}) => {
    const { handleChange } = useContext(DemoContext);
    const handleClick = useCallback(() => {
        handleChange(component);
    }, [component, handleChange]);
    return (
        <div className={cls['component-wrapper'] + (current ? ' ' + cls['current'] : '')}>
            <h2 className={cls['title']}>{title ? title : component}</h2>
            <EditButton onClick={handleClick} />
            {children}
        </div>
    );
};

export default React.memo(DemoWrap);
