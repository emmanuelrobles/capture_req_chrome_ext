import {filter, Observable} from "rxjs";

export function ofType(type: string){
    return function<T>(source: Observable<T>) {
        return source.pipe(
            // @ts-ignore
            filter(value => !!value && value.type === type)
        )
    }
}
