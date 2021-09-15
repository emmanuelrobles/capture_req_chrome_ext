import React, {useEffect, useState} from 'react';
import './App.scss';
import ReqCounterComponent from "./Components/ReqCounter/ReqCounterComponent";
import HttpMessageListenerComponent from "./Components/HttpMessagesListener/HttpMessageListenerComponent";
import {IRequestModel} from "./Models/RequestModel";

function App() {
    const [requests, setRequests] = useState<IRequestModel[]>([]);
  return (
    <div className="App">
      <header className="App-header">
          <HttpMessageListenerComponent onNewRequest={(request: IRequestModel) => {setRequests([...requests,request])}}/>
          <ReqCounterComponent requests={requests}/>
          <button onClick={() => setRequests([])}>Clear Requests</button>
      </header>
    </div>
  );
}

export default App;
