import {BehaviorSubject, filter, map, merge, mergeMap, Observable, of, tap} from "rxjs";
import {NewRequests, OnNewRequest, RequestTypeAction} from "../actions/background/requests";
import {ofType} from "../helpers/operators";
import {RequestHelper} from "../helpers/request_helper";
import BackgroundState from "../models/BackgroundState";
import {MessageTypeAction, NewMessage, OnNewMessage} from "../actions/background/message";
import {OnGetStateSuccess, SetListening, StateAction} from "../actions/background/state";
import {Message} from "../models/message";


let requests$ = new Observable<NewRequests>(subscriber => {
    chrome.runtime.onConnect.addListener(port => {
        port.onMessage.addListener(message => {
            subscriber.next(OnNewRequest(message))
            return true;
        })
        port.onDisconnect.addListener(_ => {
            subscriber.complete()
            return true;

        })
    })
})

let popup$ = new Observable<NewMessage<any>>(subscriber => {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        subscriber.next(OnNewMessage(message,sendResponse));
        return true;
    })
})

let state$ = new BehaviorSubject<BackgroundState>({
    is_listening : false,
    requests: []
})

requests$.pipe(
    ofType(RequestTypeAction.ON_NEW_REQUEST),
    filter((value:NewRequests) => RequestHelper.isValidSource(value.payload.url) && state$.value.is_listening),
).subscribe(value => {
    state$.next({...state$.value,requests: [...state$.value.requests,value.payload]})
})





let popup_req$ = popup$.pipe(
    ofType(MessageTypeAction.ON_NEW_MESSAGE),
    map(e => e.payload)
)

popup_req$.pipe(
    filter(msg => msg.data.type === StateAction.GET_STATE)
).subscribe(msg => {
    msg.sendResponse(state$.value)
})

popup_req$.pipe(
    filter(msg => msg.data.type === StateAction.SET_LISTENING)
).subscribe((msg: Message<SetListening>) => {
    state$.next({...state$.value,is_listening: msg.data.payload})
})
