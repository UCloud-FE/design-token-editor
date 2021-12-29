import React, { HTMLAttributes } from 'react';

import cls from './index.module.scss';

const Add = (props: HTMLAttributes<HTMLSpanElement>) => {
    return (
        <span className={cls['add']} {...props}>
            +
        </span>
    );
};

export default React.memo(Add);
