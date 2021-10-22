import React, { HTMLAttributes } from 'react';

import cls from './index.module.scss';

const Remove = (props: HTMLAttributes<HTMLSpanElement>) => {
    return (
        <span className={cls['remove']} {...props}>
            -
        </span>
    );
};

export default React.memo(Remove);
