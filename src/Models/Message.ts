export interface IMessage<T>{
    type:MessageType,
    payload:T
}

export enum MessageType {
    RECORD_START,
    RECORD_STOP
}
