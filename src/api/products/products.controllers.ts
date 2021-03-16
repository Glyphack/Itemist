import Product from './product.model';
import { ProductSerializer } from './products.serializers';
import { IProduct } from './product.model';
import { Request, Response } from 'express';
import { plainToClass, serialize } from 'class-transformer';

async function getProducts(req: Request, res: Response): Promise<void> {
  const products = await Product.find({ isAvailable: true }).select('-__v -seller');
  const productsSerialized = products.map((product: IProduct) => {
    return plainToClass(ProductSerializer, product);
  });
  res.json(serialize(productsSerialized));
}

export { getProducts };
