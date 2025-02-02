const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('mocks/db.json'); 
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(router);

const PORT = 3002; // Change port if needed
server.listen(PORT, () => {
  console.log(`JSON Server is running on http://localhost:${PORT}`);
});
