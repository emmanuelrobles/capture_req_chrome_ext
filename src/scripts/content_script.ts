import Port = chrome.runtime.Port;
import {MESSAGE_SOURCE} from "../models/injected_types";
import {MessageHelper} from "../helpers/message_helper";

function onNewMessage(event: any) {
    // Only accept messages from the same frame
    if (event.source !== window) {
        return;
    }

    const message = event.data;

    // Only accept messages that we know are ours
    if (typeof message !== "object" || message === null || !!message.source && message.source !== MESSAGE_SOURCE || !MessageHelper.isValidSource(message.payload.url)) {
        return;
    }
    port?.postMessage(message.payload);
}

function onDisconnect() {
    port?.disconnect();
    port?.onDisconnect.removeListener(onDisconnect)
    port = undefined;
    window.removeEventListener("message", onNewMessage)
}

if (!chrome.runtime.onMessage.hasListeners()) {
    const script = document.createElement('script');
    script.src = chrome.runtime.getURL('injected.js');
    script.onload = function () {
        // @ts-ignore
        this.remove();
    };
    (document.head || document.documentElement).appendChild(script);
    window.addEventListener("message", onNewMessage);

}


let port: Port | undefined = chrome.runtime.connect();
port.onDisconnect.addListener(onDisconnect)
