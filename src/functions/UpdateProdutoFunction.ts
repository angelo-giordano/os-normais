import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { executeQuery } from "../shared/database";

export async function UpdateProdutoFunction(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`HTTP function processed request for url "${request.url}"`);

    const { Id, Nome } = await request.json();

    try {
        const query = `UPDATE Produto SET Nome = '${Nome}' WHERE Id = '${Id}'`;
        await executeQuery(query);
        return { body: "Produto atualizado com sucesso." };
    } catch (error) {
        context.log(`Error: ${error}`);
        return { status: 500, body: "Erro ao atualizar produto." };
    }
};

app.http('UpdateProdutoFunction', {
    methods: ['PUT'],
    authLevel: 'anonymous',
    handler: UpdateProdutoFunction
});
