import React, { useCallback, useState } from 'react';

import cls from './index.module.scss';

import { clone, get, merge, sleep, output } from './utils';
import EditContext from './EditContext';
import BIPage from './BIPage';
import Main from './Main';
import useRefState from './hooks/useRefState';
import { ComponentDemos, RenderComponentDemosWrap, Tokens } from './interface';
import defaultTokens from './defaultTokens';

const Loading = ({ loading }: { loading: boolean }) => {
    return (
        <div className={cls['loading']} hidden={!loading}>
            <div>
                <svg className={cls['indicator']} viewBox="0 0 24 24">
                    <path d="M12 2a1 1 0 010 2.09A7.91 7.91 0 1019.91 12 1 1 0 0122 12 10 10 0 1112 2z"></path>
                </svg>
            </div>
            <div>导入中</div>
        </div>
    );
};

function DesignTokenEditor({
    onChange,
    token = defaultTokens,
    componentDemos,
    renderComponentDemosWrap,
}: {
    onChange?: (tokens: { [key: string]: string }) => void;
    token?: Tokens;
    componentDemos?: ComponentDemos;
    renderComponentDemosWrap?: RenderComponentDemosWrap;
}) {
    // use key to force control render
    const [key, setKey] = useState(0);
    const [fileName, setFileName] = useState('design_tokens');
    const [loading, setLoading] = useState(false);
    const [originTokens, setOriginTokens] = useState(token);
    const [currentTokens, setCurrentTokens, currentTokensRef] = useRefState(() =>
        clone(originTokens),
    );

    const [panel, setPanel] = useState('default');
    const [outputTokens, setOutputTokens] = useState(() => {
        return output(originTokens);
    });

    const handleChange = useCallback(() => {
        if (!onChange || !renderComponentDemosWrap) return;
        const outputTokens = output(currentTokens);
        onChange?.(outputTokens);
        setOutputTokens(outputTokens);
    }, [currentTokens, onChange, renderComponentDemosWrap]);

    const handleImport = useCallback(
        async (fullToken: Tokens, fileName: string) => {
            setLoading(true);
            await sleep(1);
            fullToken = merge(token, fullToken);
            setOriginTokens(fullToken);
            setCurrentTokens(clone(fullToken));
            setKey((key) => key + 1);
            setFileName(fileName);
            await sleep(1);
            setLoading(false);
            handleChange();
        },
        [handleChange, setCurrentTokens, token],
    );

    const handleCommonTokenChange = useCallback(
        (target: string[], value: string) => {
            const to = get(currentTokensRef.current.common, target);
            if (!to) {
                console.error(`Can't change value for ${target}`);
                return false;
            }
            to.value = value;
            handleChange();
            return true;
        },
        [currentTokensRef, handleChange],
    );
    const handleComponentTokenChange = useCallback(
        (target: string[], value: string) => {
            const to = get(currentTokensRef.current.component, target);
            if (!to) {
                console.error(`Can't change value for ${target}`);
                return false;
            }
            to.value = value;
            handleChange();
            return true;
        },
        [currentTokensRef, handleChange],
    );
    const handleExternalTokenChange = useCallback(
        (target: string[], value: string) => {
            const to = get(currentTokensRef.current.external, target);
            if (!to) {
                console.error(`Can't change value for ${target}`);
                return false;
            }
            to.value = value;
            handleChange();
            return true;
        },
        [currentTokensRef, handleChange],
    );
    const handleBIValueChange = useCallback(
        (target: string[], value: string) => {
            const to = get(currentTokensRef.current.builtin, target);
            if (!to) {
                console.error(`Can't change value for ${target}`);
                return false;
            }
            to.value = value;
            handleChange();
            return true;
        },
        [currentTokensRef, handleChange],
    );
    const handleBIBack = useCallback(() => {
        setPanel('default');
    }, [setPanel]);

    return (
        <div className={cls['max-wrap']}>
            <div className={cls['wrap']}>
                <Loading loading={loading} />
                <EditContext.Provider
                    key={key}
                    value={{
                        handleCommonTokenChange,
                        handleComponentTokenChange,
                        handleExternalTokenChange,
                        handleBIValueChange,
                        fileName,
                        handleImport,
                        setPanel,
                        originTokens,
                        currentTokens,
                        componentDemos,
                        renderComponentDemosWrap,
                        outputTokens,
                    }}>
                    <div className={cls['main']}>
                        {panel === 'default' && <Main />}
                        {panel === 'bi' && <BIPage onBack={handleBIBack} />}
                    </div>
                </EditContext.Provider>
            </div>
        </div>
    );
}

export default DesignTokenEditor;
