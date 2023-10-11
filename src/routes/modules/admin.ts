import express from 'express'
import * as adminController from '../../controllers/admin-controllers'

const router = express.Router()

router.get('/', adminController.index)

export default router
