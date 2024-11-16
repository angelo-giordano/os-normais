import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { executeQuery } from "../shared/database";

export async function ReadProdutoFunction(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`HTTP function processed request for url "${request.url}"`);

    const id = request.query.get('id');

    try {
        const query = `SELECT * FROM Produto WHERE Id = '${id}'`;
        const results = await executeQuery(query);
        return { body: results };
    } catch (error) {
        context.log(`Error: ${error}`);
        return { status: 500, body: "Erro ao ler produto." };
    }
};

app.http('ReadProdutoFunction', {
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: ReadProdutoFunction
});
