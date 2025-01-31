const express = require('express');
const bodyParser = require('body-parser');
const db = require('./utils/db');

const app = express();
app.use(bodyParser.json());

// Middleware para logs de requisição
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// CRUD Endpoints para Locadoras
// POST /locadoras
app.post('/locadoras', async (req, res) => {
    try {
        // Validar dados recebidos
        const { nome, endereco, ativa = true } = req.body;
        
        if (!nome || !endereco) {
            return res.status(400).json({
                mensagem: 'Nome e endereço são obrigatórios'
            });
        }

        // Ler banco de dados
        const dados = await db.lerArquivo();

        // Criar nova locadora
        const novaLocadora = {
            id: db.gerarId(),
            nome,
            endereco,
            ativa,
            criadoEm: new Date().toISOString()
        };

        // Adicionar à lista
        dados.locadoras.push(novaLocadora);

        // Salvar alterações
        await db.salvarArquivo(dados);

        res.status(201).json({
            mensagem: 'Locadora criada com sucesso',
            locadora: novaLocadora
        });
    } catch (erro) {
        console.error('Erro ao criar locadora:', erro);
        res.status(500).json({
            mensagem: 'Erro interno do servidor',
            erro: erro.message
        });
    }
});

// GET /locadoras
app.get('/locadoras', async (req, res) => {
    try {
        const dados = await db.lerArquivo();
        res.json(dados.locadoras);
    } catch (erro) {
        console.error('Erro ao listar locadoras:', erro);
        res.status(500).json({
            mensagem: 'Erro ao buscar locadoras'
        });
    }
});

// GET /locadoras/:id
app.get('/locadoras/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const dados = await db.lerArquivo();
        
        const locadora = dados.locadoras.find(l => l.id === id);
        
        if (!locadora) {
            return res.status(404).json({
                mensagem: 'Locadora não encontrada'
            });
        }

        res.json(locadora);
    } catch (erro) {
        console.error('Erro ao buscar locadora:', erro);
        res.status(500).json({
            mensagem: 'Erro ao buscar locadora'
        });
    }
});

// PUT /locadoras/:id
app.put('/locadoras/:id', async (req, res) => {
    try {
        const id = req.params.id;
        
        // Validar dados recebidos
        const { nome, endereco, ativa } = req.body;
        
        if (!nome || !endereco) {
            return res.status(400).json({
                mensagem: 'Nome e endereço são obrigatórios'
            });
        }

        const dados = await db.lerArquivo();
        
        const index = dados.locadoras.findIndex(l => l.id === id);
        
        if (index === -1) {
            return res.status(404).json({
                mensagem: 'Locadora não encontrada'
            });
        }

        // Atualizar locadora
        dados.locadoras[index] = {
            ...dados.locadoras[index],
            nome,
            endereco,
            ativa,
            atualizadoEm: new Date().toISOString()
        };

        await db.salvarArquivo(dados);

        res.json({
            mensagem: 'Locadora atualizada com sucesso',
            locadora: dados.locadoras[index]
        });
    } catch (erro) {
        console.error('Erro ao atualizar locadora:', erro);
        res.status(500).json({
            mensagem: 'Erro interno do servidor',
            erro: erro.message
        });
    }
});

// DELETE /locadoras/:id
app.delete('/locadoras/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const dados = await db.lerArquivo();
        
        const index = dados.locadoras.findIndex(l => l.id === id);
        
        if (index === -1) {
            return res.status(404).json({
                mensagem: 'Locadora não encontrada'
            });
        }

        // Remover locadora
        dados.locadoras.splice(index, 1);
        
        await db.salvarArquivo(dados);

        res.status(204).send();
    } catch (erro) {
        console.error('Erro ao excluir locadora:', erro);
        res.status(500).json({
            mensagem: 'Erro interno do servidor',
            erro: erro.message
        });
    }
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