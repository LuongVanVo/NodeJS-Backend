"use strict";

import AccessService from "../services/access.service.js";
import { OK, CREATED, SuccessResponse } from "../core/success.response.js";
class AccessController {
  login = async (req, res, next) => {
    new SuccessResponse({
      metadata: await AccessService.login(req.body)
    }).send(res);
  }
  signUp = async (req, res, next) => {
    new CREATED({
      message: "Registered OK!",
      metadata: await await AccessService.signUp(req.body),
      options: {
        limit: 10
      }
    }).send(res);
    // return res.status(201).send(await AccessService.signUp(req.body))
  };
}

export default new AccessController();
