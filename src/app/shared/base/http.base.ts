import { HttpClient, HttpHeaders, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { throwError } from "rxjs";

@Injectable()
export class HttpBase {

    constructor(
        protected HttpClient: HttpClient) { }

    protected headers = new HttpHeaders()
        .append('Content-Type', 'application/json');

    protected handleError(errorResponse: HttpErrorResponse) {
        return throwError('Es ist ein Fehler passiert!');
    }

    protected getServerErrorMessage(error: HttpErrorResponse): string {
        switch (error.status) {
            case 404: {
                return `Not Found: ${error.message}`;
            }
            case 403: {
                return `Access Denied: ${error.message}`;
            }
            case 500: {
                return `Internal Server Error: ${error.message}`;
            }
            default: {
                return `Unknown Server Error: ${error.message}`;
            }
        }
    }
}
