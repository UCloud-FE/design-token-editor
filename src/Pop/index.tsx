import React, { ReactNode, useCallback, useEffect, useRef, useState } from 'react';

import cls from './index.module.scss';

const Pop = ({ children, popup }: { children: ReactNode; popup: ReactNode }) => {
    const [visible, setVisible] = useState(false);
    const popupRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLDivElement>(null);
    const handleSquareClick = useCallback(() => {
        setVisible((visible) => !visible);
    }, []);
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
    }, []);
    return (
        <div className={cls.wrapper}>
            <div className={cls.trigger} onClick={handleSquareClick} ref={triggerRef}>
                {children}
            </div>
            <div className={cls.popup} hidden={!visible} ref={popupRef}>
                <div className={cls['popup-wrapper']}>
                    <div className={cls.triangle}></div>
                    {popup}
                </div>
            </div>
        </div>
    );
};

export default Pop;
