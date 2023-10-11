import express, { type Request, type Response } from 'express'

import * as productionController from '../controllers/production-controller'

const router = express.Router()

router.get('/products', productionController.getProducts)
router.get('/', (req: Request, res: Response) => { res.redirect('/products') })

export default router
