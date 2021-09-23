/*global chrome*/
import {BehaviorSubject, distinct, distinctUntilChanged, filter, Subject, tap} from "rxjs";
import {IRequestModel} from "../Models/RequestModel";
import {IMessage, MessageType} from "../Models/Message";

chrome.runtime.onInstalled.addListener(() => {
    clearStorage()
})

let clearStorage = () => chrome.storage.local.set({
    listening: false,
    requests: []
})

const requestSubject = new Subject<IRequestModel>();
const listeningSubject = new BehaviorSubject<boolean>(false);
const allRequestSubject = new BehaviorSubject<IRequestModel[]>([]);

const REGEX_URLS: RegExp[] = [new RegExp(".*api-qa\\.junipermarket\\.com.*"), new RegExp(".*api-dev\\.junipermarket\\.com.*")]

let filteredReq$ = requestSubject.pipe(
    filter(e => listeningSubject.value && REGEX_URLS.some(rx => rx.test(e.url))),
    distinct(e => e.time_stamp)
).subscribe(req => {
    chrome.storage.local.get("requests", (data) => {
        if (!chrome.runtime.lastError) {
            chrome.storage.local.set({requests: [...data.requests, req]}, () => {
                if (!chrome.runtime.lastError) {
                }
            })
        }

    })
})

let listening$ = listeningSubject.pipe(
    distinctUntilChanged()
)

let allRequest$ = allRequestSubject;

chrome.storage.onChanged.addListener(function (changes, namespace) {
    for (let [key, {oldValue, newValue}] of Object.entries(changes)) {
        if (key === "listening") {
            listeningSubject.next(newValue)
        }
        if (key === "requests") {
            allRequestSubject.next(newValue)
        }
    }
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    const REGEX_URLS = [new RegExp(".*qa\\.junipermarket\\.com.*"), new RegExp(".*dev\\.junipermarket\\.com.*")]

    // @ts-ignore
    if (tab.status === "complete" && /^https?/.test(tab.url) && REGEX_URLS.some(rx => rx.test(tab.url))) {
        chrome.tabs.executeScript(tabId, {file: "contentScript.js"});

        chrome.runtime.onConnect.addListener(port => {
            port.onMessage.addListener((message) => {
                chrome.storage.local.get("listening", data => {
                    if (data.listening || true) {
                        requestSubject.next(message.payload)
                    }
                })
            })
        })
    }
})

chrome.runtime.onMessage.addListener((message: IMessage<any>, sender, sendResponse) => {
    switch (message.type) {
        case MessageType.RECORD_START:
            SendScreenRecordStartRequest()
            break;
        case MessageType.RECORD_STOP:
            SendScreenRecordStopRequest()
            break;
    }
    return true
})

function SendScreenRecordStartRequest() {
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        // @ts-ignore
        chrome.tabs.sendMessage(tabs[0].id, {message: "record_start"});
    });
}

function SendScreenRecordStopRequest() {
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        // @ts-ignore
        chrome.tabs.sendMessage(tabs[0].id, {message: "record_stop",web_requests:allRequest$.value});
    });
}

export default {incomingReq$: filteredReq$, listening$, allRequest$}

