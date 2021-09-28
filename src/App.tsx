import './App.css';

import React, {
    MouseEvent,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';

import bi from '../dt/bi.json';
import dt from '../dt/dt.json';
import dtc from '../dt/dtc.json';
import external from '../dt/external.json';
import Color from './Editor/Color';
import Input from './Editor/Input';
import Shadow from './Editor/Shadow';
import Size from './Editor/Size';
import cls from './index.module.scss';
import noop from './utils/noop';
import DesignTokenContext from './DesignTokenContext';
import ColorChooser from './Editor/ColorChooser';

const ComponentPanel = () => {
    return <div className={cls.panel}></div>;
};

type TokenType = 'COLOR' | 'SHADOW' | 'INPUT';

interface TokenDefine {
    value: string;
    comment: string;
    type?: TokenType;
    deprecated?: boolean;
}

interface Token {
    value: string;
    comment: string;
    type?: TokenType;
    target: string[];
}

const EditContext = React.createContext<{
    handleChange: (target: string[], value: string) => boolean;
}>({ handleChange: () => false });

const targetToName = (target: string[]) => {
    return target.join(',');
};
const nameToTarget = (name: string) => {
    return name.split(',');
};

const Editor = React.memo(
    ({
        value: _value,
        name,
        type,
    }: {
        value: string;
        name: string;
        type?: TokenType;
    }) => {
        const [value, setValue] = useState(_value);
        type = useMemo(() => {
            if (type) return type;
            const target = nameToTarget(name);
            if (target.includes('shadow')) return 'SHADOW';
            if (target.includes('color')) return 'COLOR';
            return 'INPUT';
        }, []);
        const { handleChange } = useContext(EditContext);
        const onChange = useCallback((v: string) => {
            const target = nameToTarget(name);
            if (handleChange(target, v)) {
                setValue(v);
            }
        }, []);
        switch (type) {
            case 'COLOR':
                return <ColorChooser value={value} onChange={onChange} />;
            case 'SHADOW':
                return <Shadow value={value} onChange={onChange} />;
            case 'INPUT':
            default:
                return <Input value={value} onChange={onChange} />;
        }
    },
);

const CommonPanel = ({ commonDesignTokens }: { commonDesignTokens: typeof dtc }) => {
    const items = useMemo(() => {
        const itemsGroup: Record<string, Token[]> = {};
        const dig = (obj: any, parent: string[], group?: string) => {
            if (obj._meta) {
                if (obj._meta.group) {
                    if (group) {
                        console.error(
                            `Group hierarchy disorder: ${group} ${obj._meta.group}`,
                        );
                    }
                    group = obj._meta.group as string;
                    if (!(group in itemsGroup)) {
                        itemsGroup[group] = [];
                    }
                }
            }
            for (const key in obj) {
                if (key === '_meta') continue;
                const info = obj[key];
                if ('value' in info) {
                    if (!group) {
                        console.error(`Can't find group for`, info);
                        break;
                    }
                    const { value, comment, type, isDeprecated } = info;
                    if (isDeprecated) return;
                    const target = [...parent, key];
                    itemsGroup[group].push({
                        value,
                        type: type?.toUpperCase(),
                        comment,
                        target,
                    });
                } else {
                    dig(info, [...parent, key], group);
                }
            }
        };
        dig(commonDesignTokens, []);
        const items: {
            name: string;
            items: Token[];
        }[] = [];
        for (const group in itemsGroup) {
            const groupInfo = itemsGroup[group];
            items.push({
                name: group,
                items: groupInfo,
            });
        }
        return items;
    }, [commonDesignTokens]);

    return (
        <div className={cls.panel}>
            <ul className={cls['group-list']}>
                {items.map((group) => {
                    return (
                        <li key={group.name}>
                            <h2 className={cls['group-name']}>{group.name}</h2>
                            <ul className={cls['token-list']}>
                                {group.items.map((token) => {
                                    const { comment, value, type, target } = token;
                                    return (
                                        <li key={target.join('_')}>
                                            <h3 className={cls.comment}>{comment}</h3>
                                            <div className={cls.key}>
                                                {['t', ...target].join('_').toUpperCase()}
                                            </div>
                                            <div className={cls.editor}>
                                                <Editor
                                                    value={value}
                                                    name={targetToName(target)}
                                                    type={type}
                                                />
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

type TabType = 'component' | 'common';

const Container = ({
    component,
    commonDesignTokens,
}: {
    component: string;
    commonDesignTokens: typeof dtc;
}) => {
    const [tab, setTab] = useState<TabType>('component');
    const isComponentValid = useMemo(() => component in dt, [component]);
    useEffect(() => {
        if (isComponentValid) {
            setTab('component');
        } else {
            setTab('common');
        }
    }, [component, isComponentValid]);
    const handleTab = useCallback((e: MouseEvent) => {
        if (!e.currentTarget) return;
        const dataset = (e.currentTarget as HTMLElement).dataset;
        if (dataset.disabled === 'true' || dataset.active === 'true') {
            return;
        }
        setTab(dataset.tab as TabType);
    }, []);
    return (
        <div className={cls.container}>
            <nav>
                <ul>
                    <li
                        data-active={tab === 'component'}
                        data-disabled={!isComponentValid}
                        data-tab="component"
                        onClick={handleTab}
                    >
                        组件变量
                    </li>
                    <li
                        data-active={tab === 'common'}
                        data-tab="common"
                        onClick={handleTab}
                    >
                        通用变量
                    </li>
                </ul>
            </nav>
            <div hidden={tab !== 'component'}>
                <ComponentPanel />
            </div>
            <div hidden={tab !== 'common'}>
                <CommonPanel commonDesignTokens={commonDesignTokens} />
            </div>
        </div>
    );
};

const clone = function <T>(json: T): T {
    return JSON.parse(JSON.stringify(json));
};

function App() {
    const [component, setComponent] = useState('button');
    const commonDesignTokens = useMemo(() => clone(dtc), []);
    const commonDesignTokensRef = useRef(commonDesignTokens);

    const handleChange = useCallback((target: string[], value: string) => {
        let to: any = commonDesignTokensRef.current;
        for (let i = 0; i < target.length; i++) {
            to = to[target[i]];
            if (!to) {
                console.error(`Can't change value for ${target}`);
                return false;
            }
        }
        if (to) to.value = value;
        return true;
    }, []);

    return (
        <DesignTokenContext.Provider value={{ bi }}>
            <EditContext.Provider value={{ handleChange }}>
                <div className="App">
                    <Container
                        component={component}
                        commonDesignTokens={commonDesignTokens}
                    />
                </div>
            </EditContext.Provider>
        </DesignTokenContext.Provider>
    );
}

export default App;
