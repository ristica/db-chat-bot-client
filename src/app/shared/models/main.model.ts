export class DatabaseSchemaRequestDto {
    connectionString?: string;
    name?: string;
    databaseType?: string;
}

export class DatabaseSchemaResponseDto {
    schemaStructured: TableSchemaDto[] = [];
    schemaRaw: string[] = [];
}

export class TableSchemaDto {
    tableName?: string;
    columns?: string[] = [];
}

export class StatementRequestDto {
    openAiEndpoint?: string;
    openAiKey?: string;
    modelName?: string;
    serviceName?: string;
    prompt?: string;
    schema: string[] = [];
    databaseType?: string;
}

export class StatementResponseDto {
    query?: string;
    summary?: string;
}
export class QueryRequestDto {
    connectionString?: string;
    databaseType?: string;
    sqlQuery?: string;
}

export class QueryResponseDto {
    rawData: string[][] = [];
}