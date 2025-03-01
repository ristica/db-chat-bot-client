import { Injectable } from "@angular/core";
import { HttpBase } from "./base/http.base";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment.development";
import { lastValueFrom } from "rxjs";
import { DatabaseSchemaRequestDto, DatabaseSchemaResponseDto, QueryRequestDto, QueryResponseDto, StatementRequestDto, StatementResponseDto } from "./models/main.model";

@Injectable({
    providedIn: 'root'
})
export class HttpMainService extends HttpBase {

    private dbApiService = environment.dbServiceHost;
    private aiApiService = environment.aiServiceHost;

    constructor(hc: HttpClient) {
        super(hc);
    }

    async getConnection(request: DatabaseSchemaRequestDto): Promise<DatabaseSchemaResponseDto> {
        return await lastValueFrom(
            this.HttpClient.post<DatabaseSchemaRequestDto>(
                this.dbApiService,
                JSON.stringify(request),
                { headers: this.headers })
                .pipe((data: any) => data)
        );
    }

    async getGeneratedQuery(request: StatementRequestDto): Promise<StatementResponseDto> {
        return await lastValueFrom(
            this.HttpClient.post<StatementRequestDto>(
                this.aiApiService + '/generatequery',
                JSON.stringify(request),
                { headers: this.headers })
                .pipe((data: any) => data)
        );
    }

    async queryDatabase(request: QueryRequestDto): Promise<QueryResponseDto> {
        return await lastValueFrom(
            this.HttpClient.post<QueryRequestDto>(
                this.dbApiService + '/executequery',
                JSON.stringify(request),
                { headers: this.headers })
                .pipe((data: any) => data)
        );
    }
}