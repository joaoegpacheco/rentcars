const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// Middleware para logs de requisição
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// CRUD Endpoints para Locadoras
app.post('/locadoras', (req, res) => {
    const locadora = req.body;
    // lógica de criação
    res.status(201).json({ mensagem: 'Locadora criada com sucesso' });
});

app.get('/locadoras', (req, res) => {
    // lógica de listagem
    res.json([{ id: 1, nome: 'Exemplo' }]);
});

app.get('/locadoras/:id', (req, res) => {
    const id = req.params.id;
    // lógica de busca por ID
    res.json({ id: 1, nome: 'Exemplo' });
});

app.put('/locadoras/:id', (req, res) => {
    const id = req.params.id;
    // lógica de atualização
    res.json({ mensagem: 'Locadora atualizada com sucesso' });
});

app.delete('/locadoras/:id', (req, res) => {
    const id = req.params.id;
    // lógica de exclusão
    res.status(204).send();
});

// Endpoint de Pesquisa de Veículos
app.get('/pesquisa', async (req, res) => {
    try {
        // Buscar locadoras ativas
        const locadoras = await buscarLocadorasAtivas();
        
        // Buscar veículos disponíveis em cada locadora
        const resultados = [];
        for (const locadora of locadoras) {
            const veiculos = await consultarApiMock(locadora);
            resultados.push(...veiculos);
        }
        
        res.json(resultados);
    } catch (erro) {
        console.error('Erro na pesquisa:', erro);
        res.status(500).json({ mensagem: 'Erro ao buscar veículos disponíveis' });
    }
});

// Funções auxiliares
async function buscarLocadorasAtivas() {
    // lógica de busca de locadoras ativas
    return [{ id: 1, nome: 'Locadora Exemplo', ativa: true }];
}

async function consultarApiMock(locadora) {
    // Simular consulta à API mockada da locadora
    return [
        { nome: "Chevrolet Onix", categoria: "Econômico", preco: 120 },
        { nome: "Toyota Corolla", categoria: "Sedan", preco: 200 }
    ];
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});