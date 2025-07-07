'use strict'
import express from 'express';
import { asyncHandler } from "../../helpers/asyncHandler.js";
import { authentication } from '../../auth/authUtils.js';
import productController from '../../controllers/product.controller.js';

const router = express.Router();

// search khong can check authen trong viec tim kiem
router.post("/search/:keySearch", asyncHandler(productController.getListSearchProduct));

router.get("/", asyncHandler(productController.findAllProducts));
router.get("/:product_id", asyncHandler(productController.findProduct));

// authentication
router.use(authentication);
// create Product
router.post('/', asyncHandler(productController.createProduct));
router.post('/publish/:id', asyncHandler(productController.publishProductByShop));
router.post('/unpublish/:id', asyncHandler(productController.unPublishProductByShop));

/// QUERY //
router.get('/drafts/all', asyncHandler(productController.getAllDraftsForShop));
router.get('/published/all', asyncHandler(productController.getAllPublishForShop));

export default router;