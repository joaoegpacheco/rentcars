const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('./db/veiculos-disponiveis.json');
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(router);

const MOCK_PORT = process.env.MOCK_PORT || 3001;
server.listen(MOCK_PORT, () => {
    console.log(`Mock API rodando na porta ${MOCK_PORT}`);
});