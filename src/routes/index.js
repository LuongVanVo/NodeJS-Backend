"use strict";

import express from "express";
import accessRouter from './access/index.js';

const router = express.Router();

router.use('/v1/api', accessRouter);
// router.get("/", (req, res) => {
//   const strCompress = "Hello VoLuong";
//   return res.status(200).send({
//     message: "Welcome Everyone ",
//   });
// });

export default router;
