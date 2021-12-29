import React from 'react';

import noop from '../utils/noop';

const DemoContext = React.createContext<{ handleChange: (component: string) => void }>({
    handleChange: noop,
});

export default DemoContext;
