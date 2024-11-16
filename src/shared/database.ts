import { Connection, Request } from "tedious";

// Configuração de conexão
const config = {
    server: process.env.AZURE_SQL_SERVER,  // Endereço do servidor SQL Azure
    authentication: {
        type: "default",
        options: {
            userName: process.env.AZURE_SQL_USERNAME,  // Usuário
            password: process.env.AZURE_SQL_PASSWORD,  // Senha
        }
    },
    options: {
        database: process.env.AZURE_SQL_DATABASE,  // Banco de dados
        encrypt: true,  // Habilita criptografia (necessário para Azure SQL)
        rowCollectionOnRequestCompletion: true,  // Se os dados devem ser coletados após cada requisição
    }
};

// Função para executar a consulta SQL
export const executeQuery = (query: string): Promise<any> => {
    return new Promise((resolve, reject) => {
        // Cria a conexão com o banco de dados
        const connection = new Connection(config);

        connection.on("connect", (err) => {
            if (err) {
                reject(err);  // Se houver erro, rejeita a promessa
            } else {
                const results: any[] = [];
                const request = new Request(query, (error) => {
                    if (error) {
                        reject(error);  // Se houver erro, rejeita a promessa
                    } else {
                        resolve(results);  // Se a consulta for bem-sucedida, resolve com os resultados
                    }
                });

                // Processa os dados recebidos
                request.on("row", (columns) => {
                    const row: any = {};
                    columns.forEach((column) => {
                        row[column.metadata.colName] = column.value;  // Mapeia as colunas para um objeto
                    });
                    results.push(row);  // Adiciona a linha aos resultados
                });

                // Executa a consulta SQL
                connection.execSql(request);
            }
        });

        // Estabelece a conexão com o banco de dados
        connection.connect();
    });
};
