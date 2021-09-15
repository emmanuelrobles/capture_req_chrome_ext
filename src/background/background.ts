export default () => {

    chrome.runtime.onInstalled.addListener(() => {
        chrome.storage.local.set({
            listening:false,
            requests: []
        })
    })

// const obs = new Subject();

// obs.pipe(
//     distinct(e => e.timestamp)
// ).subscribe(e => {
//     console.log(e)
// })

    chrome.tabs.onUpdated.addListener((tabId,changeInfo,tab) => {
        const REGEX_URLS = [new RegExp(".*qa\\.junipermarket\\.com.*"),new RegExp(".*dev\\.junipermarket\\.com.*")]

        // @ts-ignore
        if(tab.status === "complete" && REGEX_URLS.some(rx => rx.test(tab.url))){
            chrome.tabs.executeScript(tabId, {file: "contentScript.js"});


            chrome.runtime.onConnect.addListener(port => {
                port.onMessage.addListener((message) => {
                    chrome.storage.local.get("listening",data => {
                        if(data.listening){
                            // obs.next(message.payload)
                        }
                    })
                })
            })
        }
    })


    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if(request.type === "listening"){
            chrome.storage.local.set({listening:request.payload},() => {
                sendResponse({
                    type:"listening",
                    payload:request.payload
                })
            })
        }
    })

}
