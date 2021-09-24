import BackgroundState from "../../models/BackgroundState";

export interface GetState {
    type: StateAction.GET_STATE,
    payload: null
}

export interface GetStateSuccess {
    type: StateAction.GET_STATE_SUCCESS,
    payload: BackgroundState
}

export interface GetStateFailure {
    type: StateAction.GET_STATE_FAILURE,
    payload: Error
}

export interface SetListening {
    type: StateAction.SET_LISTENING,
    payload: boolean
}

export enum StateAction {
    GET_STATE = "GET_STATE",
    GET_STATE_SUCCESS = "GET_STATE_SUCCESS",
    GET_STATE_FAILURE = "GET_STATE_FAILURE",
    SET_LISTENING = "SET_LISTENING"
}

export function OnGetState(): GetState {
    return {
        type: StateAction.GET_STATE,
        payload: null
    }
}

export function OnGetStateSuccess(state: BackgroundState): GetStateSuccess {
    return {
        type: StateAction.GET_STATE_SUCCESS,
        payload: state
    }
}

export function OnGetStateError(error: Error): GetStateFailure {
    return {
        type: StateAction.GET_STATE_FAILURE,
        payload: error
    }
}

export function OnSetListening(listening:boolean): SetListening{
    return {
        type:StateAction.SET_LISTENING,
        payload: listening
    }
}
