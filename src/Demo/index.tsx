import React, { useCallback, useContext } from 'react';

import EditContext from '../EditContext';
import DemoContext from './DemoContext';
import DemoWrap from './DemoWrap';

import cls from './index.module.scss';

const Demo = ({ onChange }: { onChange: (component: string) => void }) => {
    const handleChange = useCallback(
        (component) => {
            component && onChange(component);
        },
        [onChange],
    );
    const { componentDemos, renderComponentDemosWrap, outputTokens } =
        useContext(EditContext);
    const list = (
        <div className={cls['component-list']}>
            {componentDemos
                ? componentDemos.map(({ component, title, demo }) => {
                      return (
                          <DemoWrap component={component} title={title} key={component}>
                              {demo}
                          </DemoWrap>
                      );
                  })
                : null}
        </div>
    );
    return (
        <DemoContext.Provider value={{ handleChange }}>
            {renderComponentDemosWrap
                ? renderComponentDemosWrap({ children: list, tokens: outputTokens })
                : null}
        </DemoContext.Provider>
    );
};

export default React.memo(Demo);
