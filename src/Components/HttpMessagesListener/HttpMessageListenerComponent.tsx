/*global chrome*/
import React, {FC, useEffect, useState} from 'react';
import {IRequestModel} from "../../Models/RequestModel";

const HttpMessageListenerComponent = () => {
    const [isListening,setIsListening] = useState(false)



    useEffect(() => {
        chrome.storage.local.get("listening", data => {
            setIsListening(data.listening)
        })
    },[])

    useEffect(() => {
       chrome.storage.local.set({listening:isListening})
    },[isListening])

    return (
        <div>
            <button onClick={() => {setIsListening(!isListening)}}>Listening : {isListening ? "on" : "off"}</button>
        </div>
    );
};

export default HttpMessageListenerComponent;
