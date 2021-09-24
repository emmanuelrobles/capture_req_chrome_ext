import {Request} from "./request";

export default interface BackgroundState{
    is_listening:boolean,
    requests: Request[],
}
