import React, {
    useCallback,
    useEffect,
    useMemo,
    useState,
    MouseEvent,
    useContext,
} from 'react';

import cls from './index.module.scss';

import dtc from '../../dt/dtc.json';
import dt from '../../dt/dt.json';
import { Token } from '../interface';
import { targetToName } from '../utils';
import EditContext from '../EditContext';
import Editor from '../Editor';

type TabType = 'component' | 'common';

const ComponentPanelWithoutMemo = ({ component }: { component: string }) => {
    const items = useMemo(() => {
        const itemsGroup: Record<string, Token[]> = {
            [component]: [],
        };
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
        dig(dt[component as keyof typeof dt], [component], component);
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
    }, [component]);

    const { handleComponentTokenChange } = useContext(EditContext);

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
                                                    onChange={handleComponentTokenChange}
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

const ComponentPanel = React.memo(ComponentPanelWithoutMemo);

const CommonPanelWithoutMemo = ({
    commonDesignTokens,
}: {
    commonDesignTokens: typeof dtc;
}) => {
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
    const { handleCommonTokenChange } = useContext(EditContext);
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
                                                    onChange={handleCommonTokenChange}
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

const CommonPanel = React.memo(CommonPanelWithoutMemo);

const TokenEditor = ({
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
    const handleTab = useCallback((e: MouseEvent<HTMLLIElement>) => {
        if (!e.currentTarget) return;
        const dataset = e.currentTarget.dataset;
        if (dataset.disabled === 'true' || dataset.active === 'true') {
            return;
        }
        setTab(dataset.tab as TabType);
    }, []);
    return (
        <div className={cls['token-editor']}>
            <nav>
                <ul>
                    <li
                        data-active={tab === 'component'}
                        data-disabled={!isComponentValid}
                        data-tab="component"
                        onClick={handleTab}>
                        组件变量
                    </li>
                    <li
                        data-active={tab === 'common'}
                        data-tab="common"
                        onClick={handleTab}>
                        通用变量
                    </li>
                </ul>
            </nav>
            <div hidden={tab !== 'component'}>
                <ComponentPanel component={component} />
            </div>
            <div hidden={tab !== 'common'}>
                <CommonPanel commonDesignTokens={commonDesignTokens} />
            </div>
        </div>
    );
};

export default React.memo(TokenEditor);
