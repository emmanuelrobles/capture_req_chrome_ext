/*global chrome*/
import React, {FC, useEffect, useState} from 'react';
import WebRequestBodyDetails = chrome.webRequest.WebRequestBodyDetails;
import {filter, map, Subject} from "rxjs";
import {useObservable, useSubscription} from "observable-hooks";

export type RequestWatch = {
    method: string,
    body?: string,
    id: string,
    source: RequestSourceWatchType
}

enum RequestSourceWatchType {
    FE = "Front_End",
    BE = "Back_End"
}


const ReqListenerComponent:FC<{onNewReq: (req: RequestWatch) => void}> = ({onNewReq}) => {

    const [listen, setListen] = useState(false)
    const [observable$] = useState(new Subject<WebRequestBodyDetails>())
    const [emit] = useState({value:(value: WebRequestBodyDetails) => {observable$.next(value)}})

    const mapReq = (details: WebRequestBodyDetails) => {
        switch (details.method){
            case "GET": {
                return {method: details.method, id: details.requestId, source: RequestSourceWatchType.FE};
            }
            default: {
                // @ts-ignore
                let postedString = decodeURIComponent(String.fromCharCode.apply(null, new Uint8Array(details.requestBody.raw[0].bytes)));
                return {method: details.method,id: details.requestId, body: postedString, source: RequestSourceWatchType.FE}
            }
        }
    }

    let request$ = useObservable(() => observable$.pipe(
        filter(v => v.type === "xmlhttprequest"),
        map(mapReq)
    ))

    useSubscription(request$, onNewReq)

    useEffect(() => {

        if(listen && !chrome.webRequest.onBeforeRequest.hasListeners()){
            chrome.webRequest.onBeforeRequest.addListener(emit.value,
                {urls: ["*://*.api-qa.junipermarket.com/*"]},
                ["blocking", "requestBody"]);
        }else
            if(!listen) {
            chrome.webRequest.onBeforeRequest.removeListener(emit.value);
            console.log(chrome.webRequest.onBeforeRequest.hasListeners())
        }
    },[listen])

    return (
        <div>
            <button onClick={() => {
                setListen(!listen)
            }}>Listening : {listen ? "true" : "false"}</button>
        </div>
    );
};

export default ReqListenerComponent;
