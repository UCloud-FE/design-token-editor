import React, { ChangeEvent, useCallback } from 'react';

import cls from './index.module.scss';

const Importer = ({ onInput }: { onInput: (input: any) => void }) => {
    const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        console.log(files);
        if (!files) return;
        const file = files[0];
        const reader = new FileReader();
        reader.readAsText(file);
        reader.onload = (e) => {
            console.log(e.target?.result);
        };
    }, []);
    return (
        <div className={cls['output']}>
            <input type="file" accept="application/json" onChange={handleChange} />
        </div>
    );
};

export default React.memo(Importer);
