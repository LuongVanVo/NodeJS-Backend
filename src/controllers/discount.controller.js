"use strict";

import DiscountService from "../services/discount.service.js";
import { SuccessResponse } from "../core/success.response.js";

class DiscountController {
  createDiscountCode = async (req, res, next) => {
    new SuccessResponse({
      message: "Create new Discount code success !!",
      metadata: await DiscountService.createDiscountCode({
        ...req.body,
        shopId: req.user.userId,
      }),
    }).send(res);
  };
  // update discount code
  updateDiscountCode = async (req, res, next) => {
    new SuccessResponse({
      message: "Update discount code success !!",
      metadata: await DiscountService.updateDiscountCode({
        shopId: req.user.userId,
        payload: {
          ...req.body,
        },
        ...req.params,
      })
    }).send(res);
  }

  // Get all discount code available with product
  getAllDiscountCodeWithProduct = async (req, res, next) => {
    new SuccessResponse({
      message: "Get all Discount code available with product success !!",
      metadata: await DiscountService.getAllDiscountCodeWithProduct({
        ...req.params,
        shopId: req.user.userId,
      }),
    }).send(res);
  };
  // Get all discount code by shop
  getAllDiscountCodeByShop = async (req, res, next) => {
    new SuccessResponse({
      message: "Get all Discount code by shop success !!",
      metadata: await DiscountService.getAllDiscountCodeByShop({
        ...req.query,
        shopId: req.user.userId,
      }),
    }).send(res);
  };

  getDiscountAmount = async (req, res, next) => {
    new SuccessResponse({
      message: "get discount amount successfully",
      metadata: await DiscountService.getDiscountAmount({
        ...req.body,
      }),
    }).send(res);
  };

  deleteDiscountCode = async (req, res, next) => {
    new SuccessResponse({
      message: "delete discount amount successfully !!",
      metadata: await DiscountService.deleteDiscountCode({
        shopId: req.user.userId,
        ...req.params,
      })
    }).send(res);
  }
}

export default new DiscountController();
