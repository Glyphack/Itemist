import express from 'express';
import path from 'path';

function setupViewEngine(app: express.Express): void {
  app.set('view engine', 'ejs');
  app.set('views', path.join(__dirname, '/../views'));
}

export { setupViewEngine };
