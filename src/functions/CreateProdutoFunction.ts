import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { executeQuery } from "../shared/database";

export async function CreateProdutoFunction(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`HTTP function processed request for url "${request.url}"`);

    const { Nome } = await request.json();

    if (!Nome) {
        return { status: 400, body: "O campo 'Nome' é obrigatório." };
    }

    try {
        context.log("Teste entrou aqui");
        const query = `INSERT INTO Produto (Nome) VALUES ('${Nome}')`;
        await executeQuery(query);

        return { status: 201, body: "Produto criado com sucesso." };
    } catch (error) {
        return { status: 500, body: "Erro ao criar produto." };
    }
};

app.http('CreateProdutoFunction', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: CreateProdutoFunction
});
