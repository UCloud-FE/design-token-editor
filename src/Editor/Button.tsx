import React, { ButtonHTMLAttributes } from 'react';

import cls from './index.module.scss';

const Button = (props: ButtonHTMLAttributes<HTMLButtonElement>) => {
    return <button {...props} className={cls.button} />;
};

export default Button;
