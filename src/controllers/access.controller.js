"use strict";

import AccessService from "../services/access.service.js";

class AccessController {
  signUp = async (req, res, next) => {
    try {
      console.log(`[P]::signUp::`, req.body);
      // 200: OK
      // 201: CREATED
      return res.status(201).send(await AccessService.signUp(req.body))
    } catch (err) {
      next(err);
    }
  };
}

export default new AccessController();
