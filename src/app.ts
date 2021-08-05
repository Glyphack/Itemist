import { Server } from './server/server';
import { getRoutes } from './server/routes';
import { getMongooseConnection } from './config/mongoose';
import apiRouter from './server/api/routes';
import { getAdminRouter } from './config/adminbro';
import { OrdersQueue } from './queues/orders/orders.queue';
import { OrdersWorker } from './queues/orders/orders.worker';
import { i18n } from './config/i18n';
require('./bot/bot');

const server = new Server();

const serve = async () => {
  const mongooseConnection = await getMongooseConnection();
  const ordersQueue = new OrdersQueue();
  ordersQueue.start();
  const ordersWorker = new OrdersWorker();
  ordersWorker.start();
  server.setup(getRoutes(apiRouter, getAdminRouter(mongooseConnection)), i18n);
};

void serve();

export = server.app;
