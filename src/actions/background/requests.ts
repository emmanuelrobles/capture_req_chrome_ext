import {Request} from "../../models/request";

export interface NewRequests {
    type:RequestTypeAction.ON_NEW_REQUEST,
    payload: Request
}

export enum RequestTypeAction {
    ON_NEW_REQUEST="ON_NEW_REQUEST"
}


export function OnNewRequest(req: Request): NewRequests {
    return {
        type: RequestTypeAction.ON_NEW_REQUEST,
        payload: req
    }
}
