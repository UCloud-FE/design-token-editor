import React, { useContext } from 'react';
import EditContext from '../EditContext';
import { Tokens } from '../interface';

export const currentSwitchThemeStorageKey = 'CURRENT_SWITCH_THEME';

export const psgRemoveSwitchTheme = () => {
    window.postMessage(
        { key: currentSwitchThemeStorageKey, value: 'psgRemoveSwitchTheme' },
        window.origin,
    );
};

const SwitchTheme = () => {
    const { themeMap, handleImport } = useContext(EditContext);

    const [themeName, setThemeName] = React.useState(
        localStorage.getItem(currentSwitchThemeStorageKey) || '',
    );

    React.useEffect(() => {
        if (!themeName) {
            const hasSelectedTheme = localStorage.getItem(currentSwitchThemeStorageKey);
            hasSelectedTheme && setThemeName(hasSelectedTheme);
            return;
        }
        if (themeName === localStorage.getItem(currentSwitchThemeStorageKey)) return;

        handleImport(
            themeMap?.get(themeName)?.value as Tokens,
            `design_tokens_${themeName}`,
        );
        localStorage.setItem(currentSwitchThemeStorageKey, themeName);
    }, [themeName]);

    // 当前主题状态同步
    React.useEffect(() => {
        const cbMap = {
            psgRemoveSwitchTheme: () => {
                setThemeName('');
                localStorage.setItem(currentSwitchThemeStorageKey, '');
            },
        };
        const handleMessage = (
            event: MessageEvent<{ key: string; value: keyof typeof cbMap }>,
        ) => {
            if (event.data.key !== currentSwitchThemeStorageKey) return;
            cbMap[event.data.value]?.();
        };
        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, []);

    if (!themeMap || !themeMap.size) return null;
    return (
        <select
            onChange={(e) => {
                if (!e.target.value) return;
                setThemeName(e.target.value);
            }}
            value={themeName}
            style={{ marginRight: 10, color: '#526075', border: 'none' }}>
            <option value="">切换主题</option>
            {Array.from(themeMap).map(([value, { label }], key) => {
                return (
                    <option key={value} value={value}>
                        {label}
                    </option>
                );
            })}
        </select>
    );
};

export default React.memo(SwitchTheme);
