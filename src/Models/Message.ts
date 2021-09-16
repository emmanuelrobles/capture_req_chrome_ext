export interface IMessage<T>{
    type:MessageType,
    payload:T
}

export enum MessageType {
    GET_STATE,
    RECORD_START,
    RECORD_STOP
}
