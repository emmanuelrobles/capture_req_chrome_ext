/*global chrome*/
import React, {useEffect, useState} from 'react';
import './App.scss';
import ReqCounterComponent from "./Components/ReqCounter/ReqCounterComponent";
import HttpMessageListenerComponent from "./Components/HttpMessagesListener/HttpMessageListenerComponent";
import {IRequestModel} from "./Models/RequestModel";
import bc from "./background/background";
import {tap} from "rxjs";

function App() {
    const [requests, setRequests] = useState<IRequestModel[]>([]);

    useEffect(() => {
        let subs = bc.allRequest$.subscribe(e => setRequests(e))
        return subs.unsubscribe
    },[])

  return (
    <div className="App">
      <header className="App-header">
          <HttpMessageListenerComponent onNewRequest={(request: IRequestModel) => {setRequests([...requests,request])}}/>
          <ReqCounterComponent requests={requests}/>
          <button onClick={() => {
            chrome.storage.local.set({requests:[]})
          }}>Clear Requests</button>
      </header>
    </div>
  );
}

export default App;
