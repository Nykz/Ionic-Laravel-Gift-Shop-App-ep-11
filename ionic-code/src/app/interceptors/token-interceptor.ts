import { HttpEvent, HttpHandlerFn, HttpRequest } from "@angular/common/http";
import { inject } from "@angular/core";
import { Observable, switchMap, take } from "rxjs";
import { AuthService } from "../services/auth/auth.service";

export const TokenInterceptor = (
    req: HttpRequest<any>,
    next: HttpHandlerFn
): Observable<HttpEvent<any>> => {

    const auth = inject(AuthService);

    return auth.token.pipe(
        take(1),
        switchMap((token) => {
            console.log('token: ', token);
            const authReq = req.clone({
                setHeaders: {
                    Authorization: `Bearer ${token}`
                }
            });
            return next(authReq);
        })
    )
};