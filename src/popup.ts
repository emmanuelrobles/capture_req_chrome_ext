import {OnGetState, OnSetListening} from "./actions/background/state";

console.log("popup")

chrome.runtime.sendMessage(OnSetListening(true))

setInterval(() => {
    chrome.runtime.sendMessage(OnGetState(),(response) => {
        console.log("response",response)
    })
}, 1000)
