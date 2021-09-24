import {MESSAGE_SOURCE} from "../models/injected_types";

(function (xhr: any) {

    const XHR = XMLHttpRequest.prototype;

    const open = XHR.open;
    const send = XHR.send;
    const setRequestHeader = XHR.setRequestHeader;

    XHR.open = function (method, url) {
        // @ts-ignore
        this._method = method;
        // @ts-ignore
        this._url = url;
        // @ts-ignore
        this._requestHeaders = {};
        // @ts-ignore
        this._startTime = (new Date()).toISOString();

        // @ts-ignore
        return open.apply(this, arguments);
    };

    XHR.setRequestHeader = function (header, value) {
        // @ts-ignore
        this._requestHeaders[header] = value;
        // @ts-ignore
        return setRequestHeader.apply(this, arguments);
    };


    XHR.send = function (postData) {
        // @ts-ignore
        const headers = this._requestHeaders;
        this.addEventListener('load', ev => {
            const endTime = (new Date()).toISOString();

            // @ts-ignore
            const myUrl = this._url ? this._url.toLowerCase() : this._url;
            if (myUrl) {

                if (postData) {
                    if (typeof postData === 'string') {
                        try {
                            // here you get the REQUEST HEADERS, in JSON format, so you can also use JSON.parse
                            // @ts-ignore
                            this._requestHeaders = postData;
                        } catch (err) {
                            console.log('Request Header JSON decode failed, transfer_encoding field could be base64');
                            console.log(err);
                        }
                    }
                }

                // here you get the RESPONSE HEADERS
                var responseHeaders = this.getAllResponseHeaders();

                if (this.responseType != 'blob' && this.responseText) {
                    // responseText is string or null
                    try {

                        // here you get RESPONSE TEXT (BODY), in JSON format, so you can use JSON.parse
                        const arr = this.responseText;
                        const status = this.status;
                        const timeStamp = ev.timeStamp;

                        window.postMessage({
                            source: MESSAGE_SOURCE,
                            payload: {
                                // @ts-ignore
                                url: this._url,
                                // @ts-ignore
                                method: this._method,
                                request_headers: headers,
                                response_headers: responseHeaders,
                                response_body: arr,
                                request_body: postData,
                                status: status,
                                time_stamp: timeStamp
                            }
                        }, "*")

                    } catch (err) {
                        console.log("Error in responseType try catch");
                        console.log(err);
                    }
                }

            }
        });

        this.addEventListener('error', ev => {
            window.postMessage({
                source: MESSAGE_SOURCE,
                payload: {
                    // @ts-ignore
                    url: this._url,
                    // @ts-ignore
                    method: this._method,
                    // @ts-ignore
                    request_headers: this._requestHeaders,
                    req_body: postData,
                    status: "Error"
                }
            }, "*")
        })

        // @ts-ignore
        return send.apply(this, arguments);
    };

})(XMLHttpRequest);
