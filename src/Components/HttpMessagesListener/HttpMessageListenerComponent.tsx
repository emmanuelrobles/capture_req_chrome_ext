/*global chrome*/
import React, {useEffect, useState} from 'react';
import {IMessage, MessageType} from "../../Models/Message";

const HttpMessageListenerComponent = () => {
    const [isListening,setIsListening] = useState<boolean>()
    const [requestScreen,setRequestScreen] = useState<boolean>()

    useEffect(() => {
        chrome.storage.local.get("listening", data => {
            setIsListening(data.listening)
        })
    },[])

    useEffect(() => {



        if(isListening !== null){
        }

        if(isListening === false){

        }

        chrome.storage.local.set({listening:isListening})
    },[isListening])

    useEffect(() => {
        if(requestScreen){
            chrome.runtime.sendMessage({type: MessageType.RECORD_START} as IMessage<any>)
        }else if(requestScreen === false){
            chrome.runtime.sendMessage({type: MessageType.RECORD_STOP} as IMessage<any>)
        }
    },[requestScreen])

    return (
        <div>
            <button onClick={() => {
                setIsListening(!isListening)
                setRequestScreen(!isListening)
            }}>Listening : {isListening ? "on" : "off"}</button>
        </div>
    );
};

export default HttpMessageListenerComponent;
