'use strict'
import express from 'express';
import { asyncHandler } from "../../helpers/asyncHandler.js";
import { authenticationV2 } from '../../auth/authUtils.js';
import discountController from '../../controllers/discount.controller.js';

const router = express.Router();

// get amount a discount
router.post('/amount', asyncHandler(discountController.getDiscountAmount));

// authentication
router.use(authenticationV2);
// create discount code
router.post("/", asyncHandler(discountController.createDiscountCode));
router.patch("/:codeFound", asyncHandler(discountController.updateDiscountCode));
router.get("/:code", asyncHandler(discountController.getAllDiscountCodeWithProduct));
router.get("/shop/:shopId", asyncHandler(discountController.getAllDiscountCodeByShop));

router.delete("/:codeId", asyncHandler(discountController.deleteDiscountCode));

export default router;