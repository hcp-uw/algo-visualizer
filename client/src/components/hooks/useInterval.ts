// previously we use setTimeout to make the app automatically step up for play button
// this causes a problem with react hooks that the setTimeout function of javascript only
// record the initial state, thus in subsequence callbacks it does not use the updated state variables
// for example, currentStep stays the same and nothing progresses.

// problem description and a way to get around it: https://www.youtube.com/watch?v=eTDnfS2_WE4

// we switch to setInterval to take advantage of this 'hack':
// https://overreacted.io/making-setinterval-declarative-with-react-hooks/

// below is a custom hook that on the high level acts exactly like setInterval
// but it fetches variables on the callback dynamically

import { useRef, useEffect } from "react";

export default function useInterval(callback: () => void, delay: number | null) {
    const savedCallback: { current?: () => void} = useRef();

    // Remember the latest callback.
    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    // Set up the interval.
    useEffect(() => {
        function tick() {
            if (savedCallback.current)
                savedCallback.current();
        }
        if (delay !== null) {
            let id = setInterval(tick, delay);
            return () => clearInterval(id);
        }
    }, [delay]);
}
