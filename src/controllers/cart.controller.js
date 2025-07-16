"use strict";

import CartService from "../services/cart.service.js";
import { SuccessResponse } from "../core/success.response.js";

class CartController {
  // new
  addToCart = async (req, res, next) => {
    new SuccessResponse({
      message: "Create new cart success !!",
      metadata: await CartService.addToCart(req.body),
    }).send(res);
  };
  // update
  update = async (req, res, next) => {
    new SuccessResponse({
      message: "update cart success !!",
      metadata: await CartService.addToCartV2(req.body),
    }).send(res);
  };
  // delete
  delete = async (req, res, next) => {
    new SuccessResponse({
      message: "delete cart success !!",
      metadata: await CartService.deleteUserCart(req.body),
    }).send(res);
  };

  listToCart = async (req, res, next) => {
    new SuccessResponse({
        message: "List cart success !!",
        metadata: await CartService.getListUserCart(req.query)
    }).send(res);
  }
}

export default new CartController();
