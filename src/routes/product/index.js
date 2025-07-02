'use strict'
import express from 'express';
import { asyncHandler } from "../../helpers/asyncHandler.js";
import { authentication } from '../../auth/authUtils.js';
import productController from '../../controllers/product.controller.js';

const router = express.Router();

// authentication
router.use(authentication);
// create Product
router.post('/', asyncHandler(productController.createProduct));

export default router;