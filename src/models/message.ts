export interface Message<T> {
    sendResponse: (message: any) => void,
    data: T
}
