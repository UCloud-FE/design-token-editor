import React, { useCallback, useContext } from 'react';

import EditContext from '../EditContext';
import DemoContext from './DemoContext';
import DemoWrap from './DemoWrap';

import cls from './index.module.scss';

const Demo = ({
    onChange,
    component,
}: {
    onChange: (component: string) => void;
    component: string;
}) => {
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
                ? componentDemos.map(({ component: _component, title, demo }) => {
                      return (
                          <DemoWrap
                              component={_component}
                              current={component === _component}
                              title={title}
                              key={_component}>
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
