"use strict";

import express from "express";
import accessRouter from "./access/index.js";
import { apiKey, permission } from "../auth/checkAuth.js";

const router = express.Router();

// check apikey
router.use(apiKey);
router.use(permission("0000"));
// check permission
router.use("/v1/api", accessRouter);

export default router;
