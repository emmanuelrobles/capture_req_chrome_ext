/*global chrome*/
import React, {FC, useEffect} from 'react';
import {IRequestModel} from "../../Models/RequestModel";
import "./ReqCounterComponent.scss"
import bc from "../../background/background"
import {tap} from "rxjs";

const ReqCounterComponent: FC<{requests: IRequestModel[]}> = ({requests}) => {
    let downloadRequests = (requests: IRequestModel[]) => {
        let blob = new Blob([JSON.stringify(requests)], {type: "application/json"});
        let url = URL.createObjectURL(blob);
        chrome.downloads.download({
            url: url
        });
    }

    useEffect(() => {
        let subs = bc.listening$.pipe(
            tap(e => {console.log("from react",e)})
        ).subscribe()
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
