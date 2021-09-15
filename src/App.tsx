import React, {useEffect, useState} from 'react';
import './App.scss';
import BugFormComponent from "./Components/BugForm/BugFormComponent";
import ReqListenerComponent, {RequestWatch} from "./Components/ReqListener/ReqListenerComponent";
import ReqCounterComponent from "./Components/ReqCounter/ReqCounterComponent";

function App() {
    const [requests, setRequests] = useState<RequestWatch[]>([]);

    useEffect(() => {console.log(requests)},[requests])
  return (
    <div className="App">
      <header className="App-header">
          <ReqListenerComponent onNewReq={(request: RequestWatch) => {setRequests([...requests,request])}}/>
          <ReqCounterComponent requests={requests}/>
      </header>
    </div>
  );
}

export default App;
