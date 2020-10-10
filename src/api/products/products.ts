import express, { Request } from 'express';
import Product from '../../models/product.model';

const router = express.Router();

router.get('/', async (req: Request, res) => {
  const products = await Product.find({});
  res.send(products);
});

export = router;
