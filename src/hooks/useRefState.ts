import {
    Dispatch,
    MutableRefObject,
    SetStateAction,
    useCallback,
    useRef,
    useState,
} from 'react';

const isFunction = <S>(
    setStateAction: SetStateAction<S>,
): setStateAction is (prevState: S) => S => typeof setStateAction === 'function';

const useRefState = <S>(
    initialState: S | (() => S),
): [S, Dispatch<SetStateAction<S>>, MutableRefObject<S>] => {
    const [state, setState] = useState(initialState);
    const ref = useRef(state);

    const dispatch: typeof setState = useCallback((setStateAction: any) => {
        ref.current = isFunction(setStateAction)
            ? setStateAction(ref.current)
            : setStateAction;

        setState(ref.current);
    }, []);

    return [state, dispatch, ref];
};
export default useRefState;
