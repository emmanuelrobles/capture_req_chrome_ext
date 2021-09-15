/*global chrome*/
import {BehaviorSubject, distinct, distinctUntilChanged, filter, Subject, tap} from "rxjs";
import {IRequestModel} from "../Models/RequestModel";

chrome.runtime.onInstalled.addListener(() => {
    clearStorage()
})

let clearStorage = () => chrome.storage.local.set({
    listening: false,
    requests: []
})

const request$ = new Subject<IRequestModel>();
const listening$ = new BehaviorSubject<boolean>(false);

const REGEX_URLS: RegExp[] = [new RegExp(".*api-qa\\.junipermarket\\.com.*"), new RegExp(".*api-dev\\.junipermarket\\.com.*")]

request$.pipe(
    filter(e => listening$.value && REGEX_URLS.some(rx => rx.test(e.url))),
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

listening$.pipe(
    distinctUntilChanged()
)


chrome.storage.onChanged.addListener(function (changes, namespace) {
    for (let [key, {oldValue, newValue}] of Object.entries(changes)) {
        if (key === "listening") {
            listening$.next(newValue)
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
                        request$.next(message.payload)
                    }
                })
            })
        })
    }
})

chrome.runtime.onConnect.addListener(function (port) {
    console.log("Connected .....");
    port.onMessage.addListener(function (msg) {
        console.log("message recieved", msg);
        port.postMessage("Hi Popup.js");
    });
})
