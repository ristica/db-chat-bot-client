import { Component } from "@angular/core";
import { HttpMainService } from "../shared/main.http.service";
import { DatabaseSchemaRequestDto, DatabaseSchemaResponseDto, QueryRequestDto, QueryResponseDto, StatementRequestDto } from "../shared/models/main.model";
import { MatTableDataSource } from "@angular/material/table";

@Component({
    selector: 'main-component',
    templateUrl: './main.component.html',
    styleUrl: './main.component.scss',
    standalone: false
})
export class MainComponent {

    openAiEndpoint?: string = '';
    openAiKey?: string = '';
    openAiModel?: string = '';
    connectionString?: string = '';
    connectionDatabaseType?: string = '';
    userQuery?: string;
    query?: string = '';
    summary?: string = '';
    queryResult?: QueryResponseDto = undefined;
    dataSource = new MatTableDataSource<any>();
    data?: DatabaseSchemaResponseDto = undefined;
    rows: string[][] = [];

    isLoadingResults: boolean = false;
    isAiActive: boolean = false;
    isSchemaActive: boolean = false;
    isQueryActive: boolean = false;

    constructor(private httpService: HttpMainService) {
        
    }

    async getDatabaseSchema() {
        const request: DatabaseSchemaRequestDto = {
            connectionString: this.connectionString,
            databaseType: this.connectionDatabaseType
        };

        try {
            const result = await this.httpService.getConnection(request);
            console.log('### database schema:', result);
            this.data = result;
        } catch (error) {
            console.log('=== ERROR ===');
            console.log(error);
        } finally {
            this.isLoadingResults = false;
        }
    }

    async getGeneratedQuery() {
        const request: StatementRequestDto = {
            openAiEndpoint: this.openAiEndpoint,
            openAiKey: this.openAiKey,
            modelName: this.openAiModel,
            serviceName: 'AzureOpenAI', // später !!!
            prompt: this.userQuery,
            schema: this.data!.schemaRaw,
            databaseType: this.connectionDatabaseType?.toLocaleUpperCase()
        };

        try {
            const result = await this.httpService.getGeneratedQuery(request);
            console.log('### database query:', result);
            this.query = result.query;
            this.summary = result.summary;
        } catch (error) {
            console.log('=== ERROR ===');
            console.log(error);
        } finally {
            this.isLoadingResults = false;
        }
    }

    async queryDatabase() {
        const request: QueryRequestDto = {
            connectionString: this.connectionString,
            databaseType: this.connectionDatabaseType,
            sqlQuery: this.query
        };

        try {
            const result = await this.httpService.queryDatabase(request);
            console.log('### query result:', result);
            this.queryResult = result;
            this.rows = this.queryResult.rawData.splice(1);
        } catch (error) {
            console.log('=== ERROR ===');
            console.log(error);
        } finally {
            this.isLoadingResults = false;
        }
    }

    setupBot() {
        this.isAiActive = true;
    }

    setupDb() {
        this.isSchemaActive = true;
    }

    setupQuery() {
        this.isQueryActive = true;
    }

    executeQuery() {
        this.isLoadingResults = true;
        setTimeout(async () => {
            await this.queryDatabase();
        }, 1000);
    }

    /* AI */
    onAiCancel() {
        this.isAiActive = false;
    }

    onAiOk() {
        this.isAiActive = false;
        console.log('\topen ai endpoint:\t', this.openAiEndpoint);
        console.log('\topen ai key:\t\t', this.openAiKey);
        console.log('\topen ai model:\t\t', this.openAiModel);

        console.log('### ai params done ###');
    }

    /* DATABASE */
    onDbCancel() {
        this.isSchemaActive = false;
    }

    onDbOk() {
        this.userQuery = '';
        this.query = '';
        this.summary = '';
        this.queryResult = undefined;;
        this.dataSource = new MatTableDataSource<any>();
        this.data = undefined;
        this.rows = [];

        this.isSchemaActive = false;
        console.log('\tconn string:\t\t', this.connectionString);
        console.log('\tdb type:\t\t\t', this.connectionDatabaseType);

        console.log('### db connection done ###');
        this.isLoadingResults = true;

        setTimeout(async() => {
            await this.getDatabaseSchema();
        }, 1000);
    }

    /* QUERY */
    onQueryCancel() {
        this.isQueryActive = false;
    }

    onQueryOk() {
        this.isQueryActive = false;
        console.log('\tquery:\t\t\t\t', this.userQuery);
        console.log('### query done ###');
        this.isLoadingResults = true;

        setTimeout(async () => {
            await this.getGeneratedQuery();
        }, 1000);
    }
}