/*global chrome*/
import React, {FC, useEffect, useState} from 'react';
import {
    BehaviorSubject,
    combineLatest,
    concatMap, distinct,
    filter,
    map,
    mergeMap,
    observable,
    of,
    Subject,
    switchMap,
    tap
} from "rxjs";
import {IRequestModel} from "../../Models/RequestModel";
import {useObservable, useSubscription} from "observable-hooks";

const REGEX_URLS : RegExp[] = [new RegExp(".*api-qa\\.junipermarket\\.com.*"),new RegExp(".*api-dev\\.junipermarket\\.com.*")]

const observable$ = new Subject<IRequestModel>();
const isListening$ = new BehaviorSubject<boolean>(false);

const HttpMessageListenerComponent: FC<{onNewRequest: (request: IRequestModel) => void}> = ({onNewRequest}) => {
    const [isListening,setIsListening] = useState(false)


    let request$ = useObservable(() =>
        observable$.pipe(
            distinct(req => req.time_stamp),
            filter(req => isListening$.value && REGEX_URLS.some(rx => rx.test(req.url)))
        )
    )

    useSubscription(request$,onNewRequest)
    useSubscription(isListening$,v => {
        setIsListening(v);
        chrome.runtime.sendMessage({type:"listening",payload:v})
    })

    useEffect(() => {

    },[])

    return (
        <div>
            <button onClick={() => isListening$.next(!isListening)}>Listening : {isListening ? "on" : "off"}</button>
        </div>
    );
};

export default HttpMessageListenerComponent;
