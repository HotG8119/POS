import { type Request, type Response } from 'express'

import productData from '../data/products.json'

export const getProducts = (req: Request, res: Response): void => {
  console.log(productData)
  res.render('products', { productData })
}
