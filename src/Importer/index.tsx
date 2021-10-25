import React, { ChangeEvent, Ref, useCallback, useImperativeHandle, useRef } from 'react';

export interface ImporterRef {
    trigger: () => void;
}

const Importer = (
    { onChange }: { onChange: (input: any) => void },
    ref: Ref<ImporterRef>,
) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const handleChange = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            const files = e.target.files;
            console.log(files);
            if (!files) return;
            const file = files[0];
            const reader = new FileReader();
            reader.readAsText(file);
            reader.onload = (e: ProgressEvent<FileReader>) => {
                if (!e.target?.result) return;
                if (typeof e.target.result !== 'string') return;
                const tokens = JSON.parse(e.target.result);
                onChange(tokens);
                if (inputRef.current) inputRef.current.value = '';
            };
        },
        [onChange],
    );
    useImperativeHandle(
        ref,
        () => {
            return {
                trigger: () => {
                    inputRef.current?.click();
                },
            };
        },
        [],
    );
    return (
        <input
            type="file"
            accept="application/json"
            onChange={handleChange}
            ref={inputRef}
            hidden
        />
    );
};

export default React.memo(React.forwardRef(Importer));
