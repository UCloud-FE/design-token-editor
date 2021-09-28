import { createContext } from 'react';

import bi from '../dt/bi.json';

const DesignTokenContext = createContext<{ bi: typeof bi }>({ bi });

export default DesignTokenContext;
