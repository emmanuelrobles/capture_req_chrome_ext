console.log("content")


const script = document.createElement('script');
script.src = chrome.runtime.getURL('injected.js');
script.onload = function () {
    // @ts-ignore
    this.remove();
};
(document.head || document.documentElement).appendChild(script);
