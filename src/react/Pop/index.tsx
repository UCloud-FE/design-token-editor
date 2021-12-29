import React, { ReactNode, useCallback, useEffect, useRef } from 'react';

import cls from './index.module.scss';

import useUncontrolled from '../hooks/useUncontrolled';

const Pop = ({
    visible: _visible,
    defaultVisible,
    onVisibleChange,
    children,
    popup,
}: {
    visible?: boolean;
    defaultVisible?: boolean;
    onVisibleChange?: (visible: boolean) => void;
    children: ReactNode;
    popup: ReactNode | (() => ReactNode);
}) => {
    const [visible, setVisible] = useUncontrolled(
        _visible,
        (defaultVisible = false),
        onVisibleChange,
    );
    const popupRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLDivElement>(null);
    const handleSquareClick = useCallback(() => {
        setVisible(!visible);
    }, [setVisible, visible]);
    useEffect(() => {
        const clean = (e: any) => {
            const target = e.target;
            if (popupRef.current?.contains(target)) return;
            if (triggerRef.current?.contains(target)) return;
            setVisible(false);
        };
        document.addEventListener('mousedown', clean);
        return () => {
            document.removeEventListener('mousedown', clean);
        };
    }, [setVisible]);
    return (
        <div className={cls.wrapper}>
            <div className={cls.trigger} onClick={handleSquareClick} ref={triggerRef}>
                {children}
            </div>
            {visible && (
                <div className={cls.popup} hidden={!visible} ref={popupRef}>
                    <div className={cls['popup-wrapper']}>
                        <div className={cls.triangle}></div>
                        {typeof popup === 'function' ? popup() : popup}
                    </div>
                </div>
            )}
        </div>
    );
};

export default React.memo(Pop);
