import {Message} from "../../models/message";

export interface NewMessage<T> {
    type:MessageTypeAction.ON_NEW_MESSAGE,
    payload: Message<T>
}

export enum MessageTypeAction {
    ON_NEW_MESSAGE="ON_NEW_MESSAGE"
}


export function OnNewMessage<T>(data: T, sendResponse: (response: any) => void): NewMessage<T> {
    return {
        type: MessageTypeAction.ON_NEW_MESSAGE,
        payload: {
            data,
            sendResponse
        }
    }
}
