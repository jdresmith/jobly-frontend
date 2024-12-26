import React, {useState, useEffect} from 'react';

const useLocalStorageState = (key, defaultValue=null) => {
    const [state, setState] = useState(()=>{
        let value = window.localStorage.getItem(key)
        return value || defaultValue; //returns initial state's value
    });

    useEffect(()=>{
        window.localStorage.setItem(key, JSON.stringify(state))
    }, [key, state])

    return [state, setState];
}
export default useLocalStorageState;