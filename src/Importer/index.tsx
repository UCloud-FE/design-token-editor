import React, { ChangeEvent, Ref, useCallback, useImperativeHandle, useRef } from 'react';

export interface ImporterRef {
    trigger: () => void;
}

const Importer = (
    { onChange }: { onChange: (input: any, fileName: string) => void },
    ref: Ref<ImporterRef>,
) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const handleChange = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            const files = e.target.files;
            if (!files?.length) return;
            const file = files[0];
            if (file.type !== 'application/json') {
                return console.error('File type is not JSON');
            }
            const reader = new FileReader();
            const fileName = file.name.replace(/\.json$/, '');
            reader.readAsText(file);
            reader.onload = (e: ProgressEvent<FileReader>) => {
                if (!e.target?.result) {
                    return console.error(`File read fail`);
                }
                if (typeof e.target.result !== 'string') {
                    return console.error(`File read fail`);
                }
                try {
                    const tokens = JSON.parse(e.target.result);
                    onChange(tokens, fileName);
                    if (inputRef.current) inputRef.current.value = '';
                } catch (error) {
                    console.error(error);
                }
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
