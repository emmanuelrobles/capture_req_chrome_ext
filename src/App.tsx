/*global chrome*/
import React, {useEffect, useState} from 'react';
import './App.scss';
import ReqCounterComponent from "./Components/ReqCounter/ReqCounterComponent";
import HttpMessageListenerComponent from "./Components/HttpMessagesListener/HttpMessageListenerComponent";
import {IRequestModel} from "./Models/RequestModel";
import bc from "./background/background";
import {tap} from "rxjs";

function App() {

  return (
    <div className="App">
      <header className="App-header">
          <HttpMessageListenerComponent/>
          <ReqCounterComponent/>
          <button onClick={() => {
            chrome.storage.local.set({requests:[]})
          }}>Clear Requests</button>
      </header>
    </div>
  );
}

export default App;
