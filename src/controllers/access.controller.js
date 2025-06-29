"use strict";

import AccessService from "../services/access.service.js";
import { OK, CREATED } from "../core/success.response.js";
class AccessController {
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
