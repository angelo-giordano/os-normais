import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { executeQuery } from "../shared/database";

export async function DeleteProdutoFunction(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`HTTP function processed request for url "${request.url}"`);

    const id = request.query.get('id');

    try {
        const query = `DELETE FROM Produto WHERE Id = '${id}'`;
        await executeQuery(query);
        return { body: "Produto deletado com sucesso." };
    } catch (error) {
        context.log(`Error: ${error}`);
        return { status: 500, body: "Erro ao deletar produto." };
    }
};

app.http('DeleteProdutoFunction', {
    methods: ['DELETE'],
    authLevel: 'anonymous',
    handler: DeleteProdutoFunction
});
