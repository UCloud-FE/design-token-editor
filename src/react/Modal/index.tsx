import React, { ReactNode } from 'react';

import cls from './index.module.scss';

const Modal = ({
    children,
    header,
    onClose,
    style,
}: {
    children: ReactNode;
    header: ReactNode;
    onClose: () => void;
    style?: React.CSSProperties;
}) => {
    return (
        <div className={cls['modal']}>
            <div className={cls['mask']} onClick={onClose} />
            <div className={cls['body']} style={style}>
                <div className={cls['header']}>
                    <header>{header}</header>
                    <div className={cls['closer']} onClick={onClose}>
                        X
                    </div>
                </div>
                <div className={cls['content']}>{children}</div>
            </div>
        </div>
    );
};
export default React.memo(Modal);
