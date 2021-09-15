export interface IRequestModel {
    url:string,
    method: string,
    request_headers: string,
    response_headers: string,
    request_body?: string,
    response_body?: string,
    status: number,
    time_stamp: string,
}
