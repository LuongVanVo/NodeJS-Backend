'use strict'
import express from 'express';
import { asyncHandler } from "../../helpers/asyncHandler.js";
import { authenticationV2 } from '../../auth/authUtils.js';
import cartController from '../../controllers/cart.controller.js';

const router = express.Router();

// authentication
// router.use(authenticationV2);
router.post("/", asyncHandler(cartController.addToCart));
router.delete("/", asyncHandler(cartController.delete));
router.post("/update", asyncHandler(cartController.update));
router.get("/", asyncHandler(cartController.listToCart));
export default router;