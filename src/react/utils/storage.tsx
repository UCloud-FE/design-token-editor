import React, { useCallback, useEffect, useState } from 'react';

import { Tokens, HandleImportType } from '../interface';
import Modal from '../Modal';
import Button from '../Editor/Button';

type StoreData = string | number | boolean | null | object;
const store = {
    stringify(data: StoreData): string {
        return data === undefined || typeof data === 'function'
            ? data + ''
            : JSON.stringify(data);
    },
    parse(s: string): StoreData {
        try {
            return JSON.parse(s);
        } catch (e) {
            return s;
        }
    },
    get(key: string): StoreData {
        const s = localStorage.getItem(key);
        return s !== null ? this.parse(s) : s;
    },
    set(key: string, data: StoreData): void {
        return localStorage.setItem(key, this.stringify(data));
    },
    remove(key: string): StoreData {
        const d = this.get(key);
        localStorage.removeItem(key);
        return d;
    },
    has(key: string): boolean {
        if (typeof key !== 'string') {
            key = this.stringify(key);
        }
        return !!(key in localStorage);
    },
};

export const storageKey = 'UN_SAVED_STORAGE';

export const save = (data: Tokens) => {
    store.set(storageKey, data);
};

export const remove = () => {
    store.remove(storageKey);
};

export const useStorage = ({ onImport }: { onImport: HandleImportType }) => {
    const [unSavedModal, setUnSavedModal] = useState<null | JSX.Element>(null);

    const handleUnSavedModalClose = useCallback(() => {
        setUnSavedModal(null);
    }, [unSavedModal]);

    const handleRemove = useCallback(() => {
        remove();
        handleUnSavedModalClose();
    }, [handleUnSavedModalClose]);

    const handleImport = useCallback(() => {
        onImport && onImport(store.get(storageKey) as Tokens);
        handleRemove();
    }, [handleRemove]);

    useEffect(() => {
        if (store.has(storageKey)) {
            setUnSavedModal(
                <Modal
                    style={{ width: 600, height: 300 }}
                    header="提示"
                    onClose={handleUnSavedModalClose}>
                    <div
                        style={{
                            display: 'flex',
                            height: '100%',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                        <div style={{ marginBottom: 28 }}>
                            存在未完成的编辑记录，是否导入或清除？
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <Button onClick={handleRemove}>清除</Button>
                            <Button onClick={handleImport}>导入</Button>
                        </div>
                    </div>
                </Modal>,
            );
        }
    }, []);

    return { unSavedModal };
};
