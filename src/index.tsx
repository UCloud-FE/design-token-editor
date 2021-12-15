import './index.css';

import React, { HTMLAttributes, ReactNode, useContext } from 'react';
import ReactDOM from 'react-dom';

import DesignTokenEditor from './DesignTokenEditor';
import { OutputTokens, Tokens } from './interface';

const ThemeContext = React.createContext<OutputTokens>({
    T_BUTTON_BG: 'green',
    T_BUTTON_COLOR: 'white',
});

const Button = (props: HTMLAttributes<HTMLButtonElement>) => {
    const theme = useContext(ThemeContext);
    console.log(theme);

    return (
        <button
            style={{ background: theme.T_BUTTON_BG, color: theme.T_BUTTON_COLOR }}
            {...props}
        />
    );
};

const ComponentDemosWrap = ({
    tokens,
    children,
}: {
    tokens: OutputTokens;
    children: ReactNode;
}) => {
    console.log(tokens);

    return <ThemeContext.Provider value={tokens}>{children}</ThemeContext.Provider>;
};

const componentDemos = [
    {
        title: 'Button 按钮',
        component: 'button',
        demo: (
            <>
                <Button>My Button</Button>
            </>
        ),
    },
];
const token: Tokens = {
    builtin: {
        color: {
            base: {
                _meta: {
                    group: 'base',
                },
                white: {
                    comment: '白色',
                    value: '#fff',
                },
                black: {
                    comment: '黑色',
                    value: '#000',
                },
            },
        },
    },
    common: {},
    component: {
        button: {
            bg: {
                value: '{base.white}',
                comment: '按钮背景',
                type: 'COLOR',
            },
            color: {
                value: '{base.black}',
                comment: '按钮字色',
            },
        },
    },
};

ReactDOM.render(
    <React.StrictMode>
        <DesignTokenEditor
            token={token}
            onChange={console.log}
            renderComponentDemosWrap={ComponentDemosWrap}
            componentDemos={componentDemos}
        />
    </React.StrictMode>,
    document.getElementById('root'),
);
