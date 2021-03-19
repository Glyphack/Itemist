/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* Remove when admin bro has typescript types support */
import { Router } from 'express';
import { Mongoose } from 'mongoose';
const AdminBro = require('admin-bro');
const AdminBroExpress = require('@admin-bro/express');
AdminBro.registerAdapter(require('@admin-bro/mongoose'));

const adminRootPath = process.env.ADMIN_PATH;

function getAdminRouter(mongooseConnection: Mongoose): Router {
  const adminBro = new AdminBro({
    databases: [mongooseConnection],
    rootPath: adminRootPath,
  });
  return AdminBroExpress.buildRouter(adminBro);
}

export { adminRootPath, getAdminRouter };
