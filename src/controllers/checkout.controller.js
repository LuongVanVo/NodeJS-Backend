"use strict";

import CheckoutService from "../services/checkout.service.js";
import { SuccessResponse } from "../core/success.response.js";

class CartController {

  checkoutReview = async (req, res, next) => {
    new SuccessResponse({
      message: "Create new cart success !!",
      metadata: await CheckoutService.checkoutReview(req.body),
    }).send(res);
  };
}

export default new CartController();
