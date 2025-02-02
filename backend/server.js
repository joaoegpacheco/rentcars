const express = require('express');
const bodyParser = require('body-parser');
const db = require('./utils/db');
const cors = require('cors');

const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002'
];

const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Não autorizado'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
};
const app = express();

app.use(cors(corsOptions));

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
        const locadoras = await buscarLocadorasAtivas();
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
    try {
        // Ler o arquivo de locadoras
        const dados = await db.lerArquivo();
        
        // Filtrar apenas as locadoras ativas
        const locadorasAtivas = dados.locadoras.filter(locadora => 
            locadora.ativa === true
        );
        
        // Retornar apenas os campos necessários
        return locadorasAtivas.map(locadora => ({
            id: locadora.id,
            nome: locadora.nome,
            endereco: locadora.endereco,
            ativa: locadora.ativa
        }));
    } catch (erro) {
        console.error('Erro ao buscar locadoras ativas:', erro);
        throw new Error('Erro ao buscar locadoras ativas');
    }
}

async function consultarApiMock(locadora) {
    try {
        // Simular latência de rede
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Validar se a locadora existe
        const dados = await db.lerArquivo();
        const locadoraExiste = dados.locadoras.some(l => l.id === locadora.id);
        
        if (!locadoraExiste) {
            throw new Error('Locadora não encontrada');
        }
        
        // Simular diferentes conjuntos de veículos baseados na locadora
        const veiculosDisponiveis = {
            'econômico': [
                { nome: "Chevrolet Onix", categoria: "Econômico", preco: 120 },
                { nome: "Fiat Uno", categoria: "Econômico", preco: 110 },
                { nome: "Volkswagen Gol", categoria: "Econômico", preco: 125 }
            ],
            'intermediário': [
                { nome: "Toyota Corolla", categoria: "Intermediário", preco: 200 },
                { nome: "Honda Civic", categoria: "Intermediário", preco: 210 },
                { nome: "Volkswagen Jetta", categoria: "Intermediário", preco: 205 }
            ],
            'luxo': [
                { nome: "Mercedes-Benz C-Class", categoria: "Luxo", preco: 450 },
                { nome: "BMW Série 3", categoria: "Luxo", preco: 460 },
                { nome: "Audi A4", categoria: "Luxo", preco: 455 }
            ]
        };
        
        // Selecionar veículos baseados na categoria da locadora
        const categoria = locadora.nome.toLowerCase().includes('econômico') ? 'econômico' :
                         locadora.nome.toLowerCase().includes('luxo') ? 'luxo' :
                         'intermediário';
        
        // Simular possibilidade de indisponibilidade
        if (Math.random() < 0.1) { // 10% de chance de erro
            throw new Error('Serviço indisponível no momento');
        }
        
        return veiculosDisponiveis[categoria];
    } catch (erro) {
        console.error(`Erro ao consultar API mock da locadora ${locadora.id}:`, erro);
        throw erro;
    }
}

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});