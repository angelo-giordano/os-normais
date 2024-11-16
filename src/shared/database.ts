import { Connection, Request } from "tedious";

const config = {
    server: process.env.AZURE_SQL_SERVER,
    authentication: {
        type: "default",
        options: {
            userName: process.env.AZURE_SQL_USERNAME,
            password: process.env.AZURE_SQL_PASSWORD,
        },
    },
    options: {
        database: process.env.AZURE_SQL_DATABASE,
        encrypt: true,
    },
};

export const executeQuery = (query: string): Promise<any> => {
    return new Promise((resolve, reject) => {
        const connection = new Connection(config);
        connection.on("connect", (err) => {
            if (err) {
                reject(err);
                connection.close();  // Fechar a conexão após erro
            } else {
                const results: any[] = [];
                const request = new Request(query, (error) => {
                    if (error) {
                        reject(error);
                        connection.close();  // Fechar a conexão após erro
                    } else {
                        resolve(results);
                        connection.close();  // Fechar a conexão após sucesso
                    }
                });
                request.on("row", (columns) => {
                    const row: any = {};
                    columns.forEach((column) => {
                        row[column.metadata.colName] = column.value;
                    });
                    results.push(row);
                });

                console.log(`Executing query: ${query}`);  // Log da query
                connection.execSql(request);
            }
        });
        connection.connect();
    });
};
