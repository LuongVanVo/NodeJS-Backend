"use strict";

import ProductFactory from "../services/product.service.js";
import ProductFactoryV2 from "../services/product.service.xxx.js";
import { OK, CREATED, SuccessResponse } from "../core/success.response.js";

class ProductController {
    // createProduct = async (req, res, next) => {
    //     new SuccessResponse({
    //         message: "Create new Product success",
    //         metadata: await ProductFactory.createProduct(req.body.product_type, {
    //             ...req.body,
    //             product_shop: req.user.userId
    //         })
    //     }).send(res);
    // }
    createProduct = async (req, res, next) => {
        new SuccessResponse({
            message: "Create new Product success",
            metadata: await ProductFactoryV2.createProduct(req.body.product_type, {
                ...req.body,
                product_shop: req.user.userId
            })
        }).send(res);
    }

    publishProductByShop = async (req, res, next) => {
        new SuccessResponse({
            message: "Publish Product success",
            metadata: await ProductFactoryV2.publishProductByShop({
                product_shop: req.user.userId,
                product_id: req.params.id
            })
        }).send(res);
    }

    unPublishProductByShop = async (req, res, next) => {
        new SuccessResponse({
            message: "UnPublish Product success",
            metadata: await ProductFactoryV2.unPublishProductByShop({
                product_shop: req.user.userId,
                product_id: req.params.id
            })
        }).send(res);
    }
    // QUERY //
    /**
     * @desc Get All Drafts for Shop
     * @param { Number } limit 
     * @param { Number } skip
     * @return { JSON }
     */
    getAllDraftsForShop = async (req, res, next) => {
        new SuccessResponse({
            message: "Get list Drafts success !",
            metadata: await ProductFactoryV2.findAllDraftsForShop({
                product_shop: req.user.userId
            })
        }).send(res);
    }

    getAllPublishForShop = async (req, res, next) => {
        new SuccessResponse({
            message: "Get list Publish success !",
            metadata: await ProductFactoryV2.findAllPublishForShop({
                product_shop: req.user.userId
            })
        }).send(res);
    }

    getListSearchProduct = async (req, res, next) => {
        new SuccessResponse({
            message: "Get list search Product success !",
            metadata: await ProductFactoryV2.searchProductByUser(req.params)
        }).send(res)
    }
    // END QUERY //
}
export default new ProductController();
