"use strict";

import AccessService from "../services/access.service.js";
import { OK, CREATED, SuccessResponse } from "../core/success.response.js";
class AccessController {
  handlerRefreshToken = async (req, res, next) => {
    // version 1
    // new SuccessResponse ({
    //   message: 'Get token success',
    //   metadata: await AccessService.handlerRefreshToken(req.body.refreshToken)
    // }).send(res);

    // version 2 fixed, no need accessToken
    new SuccessResponse ({
      message: "Get token success",
      metadata: await AccessService.handlerRefreshTokenV2({
        refreshToken: req.refreshToken,
        user: req.user,
        keyStore: req.keyStore
      })
    }).send(res)
  }
  logout = async (req, res, next) => {
    new SuccessResponse ({
      message: 'Logout success',
      metadata: await AccessService.logout({ keyStore: req.keyStore })
    }).send(res);
  }
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
