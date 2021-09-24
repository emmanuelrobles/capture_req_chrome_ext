const REGEX_URLS: RegExp[] = [new RegExp(".*api-.*\\.junipermarket\\.com.*")]

function isValidSourceExpression(regex: RegExp[]) {
    return (url: string) => regex.some(rx => rx.test(url))

}

export abstract class RequestHelper {
    public static isValidSource = isValidSourceExpression(REGEX_URLS)
}
