const fs = require('fs').promises;
const path = require('path');

class Database {
    constructor() {
        this.locadorasPath = path.join(__dirname, '../db/locadoras.json');
    }

    async lerArquivo() {
        try {
            const dados = await fs.readFile(this.locadorasPath, 'utf8');
            return JSON.parse(dados);
        } catch (erro) {
            if (erro.code === 'ENOENT') {
                return { locadoras: [] };
            }
            throw erro;
        }
    }

    async salvarArquivo(dados) {
        await fs.writeFile(this.locadorasPath, JSON.stringify(dados, null, 2));
    }

    gerarId() {
        const dataAtual = new Date();
        return `${dataAtual.getTime()}-${Math.random().toString(36).substr(2, 9)}`;
    }
}

module.exports = new Database();