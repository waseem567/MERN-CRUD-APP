import {useState, useCallback, useRef, useEffect} from 'react'

export default function useHttp() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState();
    const activeRequests = useRef([]);
    const httpRequest = useCallback(async (url, method="GET", body=null, headers={}) => {
        const abortController = new AbortController();
        activeRequests.current.push(abortController);
        
        try{
            const response = await fetch(url, {
                method, 
                body,
                headers,
                signal: abortController.signal
            });
            setLoading(true);
            const responseData = await response.json();
            activeRequests.current = activeRequests.current.filter(
                reqCtrl => reqCtrl !== abortController
            );
            if(!response.ok){
                console.log("There is an err")
                throw new Error(responseData.message);
            }
            setLoading(false);
            return responseData;
        }catch(err){
            setError(err.message);
        }
        setLoading(false);
    }, []);
    const clearError = () => {
        setError(null);
    };
    useEffect(()=> {
        return ()=> {
            activeRequests.current.forEach(abortCtrl => abortCtrl.abort())
        }
    }, [])
  return {error, loading, httpRequest, clearError};
}
