"use strict";

import ProductFactory from "../services/product.service.js";
import { OK, CREATED, SuccessResponse } from "../core/success.response.js";

class ProductController {
    createProduct = async (req, res, next) => {
        new SuccessResponse({
            message: "Create new Product success",
            metadata: await ProductFactory.createProduct(req.body.product_type, {
                ...req.body,
                product_shop: req.user.userId
            })
        }).send(res);
    }
}
export default new ProductController();
