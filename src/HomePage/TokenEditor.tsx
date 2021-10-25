import React, {
    useCallback,
    useEffect,
    useMemo,
    useState,
    MouseEvent,
    useContext,
} from 'react';

import cls from './index.module.scss';

import { Token } from '../interface';
import { targetToName } from '../utils';
import EditContext from '../EditContext';
import Editor from '../Editor';

type TabType = 'component' | 'common';

const groupItems = (map: any, group?: string, defaultParent?: string) => {
    const itemsGroup: Record<string, Token[]> = {};
    if (group) {
        itemsGroup[group] = [];
    }
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
    dig(map, defaultParent ? [defaultParent] : [], group);
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
};

const PanelWithoutMemo = ({
    items,
    onChange,
}: {
    items: ReturnType<typeof groupItems>;
    onChange: (target: string[], v: string) => boolean;
}) => {
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
                                                    onChange={onChange}
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
const Panel = React.memo(PanelWithoutMemo);

const ComponentPanelWithoutMemo = ({ component }: { component: string }) => {
    const { dt, handleComponentTokenChange } = useContext(EditContext);
    const items = useMemo(() => {
        console.log(
            dt,
            groupItems(dt[component as keyof typeof dt], component, component),
        );
        return groupItems(dt[component as keyof typeof dt], component, component);
    }, [component, dt]);
    return <Panel items={items} onChange={handleComponentTokenChange} />;
};
const ComponentPanel = React.memo(ComponentPanelWithoutMemo);

const CommonPanelWithoutMemo = () => {
    const { dtc, handleCommonTokenChange } = useContext(EditContext);
    const items = useMemo(() => {
        return groupItems(dtc);
    }, [dtc]);

    return <Panel items={items} onChange={handleCommonTokenChange} />;
};
const CommonPanel = React.memo(CommonPanelWithoutMemo);

const ExternalPanelWithoutMemo = () => {
    const { external, handleExternalTokenChange } = useContext(EditContext);
    const items = useMemo(() => {
        return groupItems(external, 'external');
    }, [external]);

    return <Panel items={items} onChange={handleExternalTokenChange} />;
};
const ExternalPanel = React.memo(ExternalPanelWithoutMemo);

const TokenEditor = ({ component }: { component: string }) => {
    const [tab, setTab] = useState<TabType>('component');
    const { dt } = useContext(EditContext);
    const isComponentValid = useMemo(() => component in dt, [component, dt]);
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
            {component === 'external' ? (
                <div hidden={component !== 'external'}>
                    <ExternalPanel />
                </div>
            ) : (
                <>
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
                        <CommonPanel />
                    </div>
                </>
            )}
        </div>
    );
};

export default React.memo(TokenEditor);
