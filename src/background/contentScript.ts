import Port = chrome.runtime.Port;
import JSZip from "jszip";

function onNewMessage(event: any) {
    // Only accept messages from the same frame
    if (event.source !== window) {
        return;
    }

    const message = event.data;

    // Only accept messages that we know are ours
    if (typeof message !== "object" || message === null || !!message.source && message.source !== "a-extension") {
        return;
    }

    port?.postMessage(message);
}

function onDisconnect() {
    port?.disconnect();
    port?.onDisconnect.removeListener(onDisconnect)
    port = undefined;
    window.removeEventListener("message", onNewMessage)
}

if (!chrome.runtime.onMessage.hasListeners()) {
    let mediaRecord: MediaRecorder | null = null;
    let chunks: Blob[] = []
    chrome.runtime.onMessage.addListener(
        function (request, sender, sendResponse) {
            console.log(request)
            if (request.message === "ping")
                sendResponse({message: "pong"});
            if (request.message === "record_start") {
                navigator.mediaDevices.getDisplayMedia({audio: false, video: true}).then(r => {
                    mediaRecord = new MediaRecorder(r)

                    mediaRecord.ondataavailable = (ev: BlobEvent) => {
                        chunks.push(ev.data)
                    }
                    mediaRecord.start()
                })
            }
            if (request.message === "record_stop") {
                if(!!mediaRecord){
                    mediaRecord.onstop = (ev) => {
                        let videoBlob = new Blob(chunks, {type: "video/mp4;"})
                        console.log(request.web_requests)
                        let web_request = new Blob([JSON.stringify(request.web_requests)], {type: "application/json"});
                        chunks = []
                        // maybe for later use? it takes the blob file (video) and convert it to a string,
                        // cant pass a blob to bg script :(
                        //
                        // let reader = new FileReader()
                        // reader.readAsDataURL(blob)
                        // reader.onloadend = () => {
                        //     let base64Data = reader.result
                        //     console.log("CS",base64Data)
                        //     sendResponse({video_base64:base64Data})
                        // }

                        let zip = new JSZip()
                        zip.file("video.mp4",videoBlob)
                        zip.file("web_requests,json",web_request)
                        zip.generateAsync({type:"blob"}).then(res => {
                            let url = URL.createObjectURL(res)
                            window.open(url, 'data');
                        })

                    }
                    mediaRecord?.stop()
                }
            }
            return true;
        });

    const script = document.createElement('script');
    script.src = chrome.extension.getURL('injected.js');
    script.onload = function () {
        // @ts-ignore
        this.remove();
    };
    (document.head || document.documentElement).appendChild(script);
    window.addEventListener("message", onNewMessage);

}


let port: Port | undefined = chrome.runtime.connect();
port.onDisconnect.addListener(onDisconnect)
