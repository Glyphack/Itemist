import apiRouter from '../../server/api/routes';
import { getRoutes } from '../../server/routes';
import { Server } from '../../server/server';
import { i18n } from '../../config/i18n';

const server = new Server();
server.setup(getRoutes(apiRouter), i18n);
const app = server.app;

export { app };
