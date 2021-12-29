import React, { ButtonHTMLAttributes } from 'react';

import cls from './index.module.scss';

const Button = ({ className = '', ...rest }: ButtonHTMLAttributes<HTMLButtonElement>) => {
    return <button {...rest} className={cls.button + ' ' + className} />;
};

export default React.memo(Button);
