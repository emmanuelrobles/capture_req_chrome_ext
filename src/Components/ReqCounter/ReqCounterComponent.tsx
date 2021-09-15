/*global chrome*/
import React, {FC} from 'react';
import {IRequestModel} from "../../Models/RequestModel";
import "./ReqCounterComponent.scss"

const ReqCounterComponent: FC<{requests: IRequestModel[]}> = ({requests}) => {
    let downloadRequests = (requests: IRequestModel[]) => {
        let blob = new Blob([JSON.stringify(requests)], {type: "application/json"});
        let url = URL.createObjectURL(blob);
        chrome.downloads.download({
            url: url
        });
    }
    return (
        <div className="req-counter-component-container">
            <span>Counter: {requests.length}</span>
            <button onClick={() => downloadRequests(requests)}>Download trace</button>
        </div>
    );
};

export default ReqCounterComponent;
