import { getRoutes } from '../../server/routes';
import apiRouter from '../../server/api/routes';
import { Server } from '../../server/server';

const server = new Server();
server.setup(getRoutes(apiRouter));
const app = server.app;

export { app };
