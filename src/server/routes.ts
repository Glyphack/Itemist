/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { adminRootPath } from '../config/adminbro';
import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';

function getRoutes(apiRoutes: Router, adminRoutes?: Router): Router {
  const router = Router();
  router.use('/v1', apiRoutes);
  router.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(YAML.load('./docs/OpenAPI/itemist.yaml')),
  );
  if (adminRoutes != undefined) router.use(adminRootPath, adminRoutes);
  return router;
}

export { getRoutes };
