/*global chrome*/
import React, {FC, useEffect, useState} from 'react';
import {IRequestModel} from "../../Models/RequestModel";
import "./ReqCounterComponent.scss"
import bc from "../../background/background"

const ReqCounterComponent = () => {
    const [requests, setRequests] = useState<IRequestModel[]>([]);

    let downloadRequests = (requests: IRequestModel[]) => {
        let blob = new Blob([JSON.stringify(requests)], {type: "application/json"});
        let url = URL.createObjectURL(blob);
        chrome.downloads.download({
            url: url
        });
    }

    useEffect(() => {
        let subs = bc.allRequest$.subscribe(e => setRequests(e))

        chrome.storage.local.get("requests", data => {
            setRequests(data.requests)
        })

        return subs.unsubscribe
    },[])

    return (
        <div className="req-counter-component-container">
            <span>Counter: {requests.length}</span>
            <button onClick={() => downloadRequests(requests)}>Download trace</button>
        </div>
    );
};

export default ReqCounterComponent;
