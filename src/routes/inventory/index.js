'use strict'
import express from 'express';
import { asyncHandler } from "../../helpers/asyncHandler.js";
import { authenticationV2 } from '../../auth/authUtils.js';
import InventoryController from '../../controllers/inventory.controller.js';

const router = express.Router();

// authentication
router.use(authenticationV2);
router.post("", asyncHandler(InventoryController.addStockToInventory));
export default router;