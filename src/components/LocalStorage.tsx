import { Dispatch, SetStateAction, useEffect, useState } from "react";

function useLocalStorage<T> (key: string, inititalValue?: T | (() => T)): [T, Dispatch<SetStateAction<T>>] {
    const [value, setValue] = useState<T>(() => {
        try {
            const storeValue = localStorage.getItem(key);

            if (storeValue) {
                return JSON.parse(storeValue);
            } else if (inititalValue instanceof Function) {
                return inititalValue();
            } else {
                return inititalValue;
            }
        } catch (error) {
            return inititalValue;
        }
    });

    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(value))
    }, [value, key]);

    return [value, setValue];
}

export default useLocalStorage;
