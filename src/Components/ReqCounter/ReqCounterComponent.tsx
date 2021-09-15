/*global chrome*/

import React, {FC} from 'react';
import {RequestWatch} from "../ReqListener/ReqListenerComponent";

const ReqCounterComponent: FC<{requests: RequestWatch[]}> = ({requests}) => {
    let downloadRequests = (requests: RequestWatch[]) => {
        let blob = new Blob([JSON.stringify(requests)], {type: "application/json"});
        let url = URL.createObjectURL(blob);
        chrome.downloads.download({
            url: url
        });
    }
    return (
        <div>
            <span>Counter: {requests.length}</span>
            <button onClick={() => downloadRequests(requests)}>Download trace</button>
        </div>
    );
};

export default ReqCounterComponent;
