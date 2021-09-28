import React from 'react';

const LocaleMap: { [key: string]: string } = {
    bg: '背景',
};

const Size = ({
    info: { value, comment },
}: {
    info: { value: string; comment: string };
}) => {
    const key = '';
    return (
        <div>
            <h3>{LocaleMap[value]}</h3>
            <p>{comment}</p>
            <p>{key}</p>
            <div>
                <input type="number" />
            </div>
        </div>
    );
};

export default Size;
