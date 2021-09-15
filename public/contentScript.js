let port = chrome.runtime.connect();

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.message === "ping")
            sendResponse({message: "pong"});
    });

const s = document.createElement('script');
s.src = chrome.extension.getURL('injected.js');
s.onload = function() {
    this.remove();
};

const onNewMessage = (event) => {
    // Only accept messages from the same frame
    if (event.source !== window) {
        return;
    }

    const message = event.data;

    // Only accept messages that we know are ours
    if (typeof message !== "object" || message === null || !!message.source && message.source !== "a-extension") {
        return;
    }

    port.postMessage(message);
}

const onDisconnect = () => {
    port.disconnect();
    port.onDisconnect.removeListener(onDisconnect)
    port = undefined;
    window.removeEventListener("message", onNewMessage)
}
port.onDisconnect.addListener(onDisconnect)

window.addEventListener("message", onNewMessage);

(document.head || document.documentElement).appendChild(s);


