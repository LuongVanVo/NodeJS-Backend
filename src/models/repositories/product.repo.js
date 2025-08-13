import { convertToObjectIdMongodb, getSelectData, ungetSelectData } from "../../ultis/index.js";
import productModel, { electronicModel, furnitureModel, clothingModel } from "../product.model.js";
import { Types } from "mongoose";

export const findAllDraftsForShop = async({ query, limit, skip }) => {
    return await queryProduct({ query, limit, skip });
}

export const findAllPublishForShop = async({ query, limit, skip }) => {
    return await queryProduct({ query, limit, skip });
}

export const searchProductByUser = async ({ keySearch }) => {
    const regexSearch = new RegExp(keySearch);
    const result = await productModel.find({
        isDraft: false,
        isPublished: true,
        $text: { $search: regexSearch },
    }, { score: { $meta: 'textScore' }})
    .sort({ score: { $meta: 'textScore' }})
    .lean()
    return await result;
}


export const publishProductByShop = async({ product_shop, product_id }) => {
    const foundShop = await productModel.findOne({
        product_shop: new Types.ObjectId(product_shop),
        _id: new Types.ObjectId(product_id)
    });
    if (!foundShop) return null;

    foundShop.isDraft = false;
    foundShop.isPublished = true;

    const { modifiedCount } = await foundShop.updateOne(foundShop); 
    return modifiedCount; // 0: khong co update nao, 1: update thanh cong 
}

export const unPublishProductByShop = async ({ product_shop, product_id }) => {
    const foundShop = await productModel.findOne({
        product_shop: new Types.ObjectId(product_shop),
        _id: new Types.ObjectId(product_id)
    });
    if (!foundShop) return null;

    foundShop.isDraft = true;
    foundShop.isPublished = false;

    const { modifiedCount } = await foundShop.updateOne(foundShop); 
    return modifiedCount; // 0: khong co update nao, 1: update thanh cong 
}

export const findAllProducts = async ({ limit, sort, page, filter, select }) => {
    const skip = (page - 1) * limit;
    const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1};
    const products = await productModel.find(filter)
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .select(getSelectData(select))
        .lean()

        return products;
}

// get detail a product
export const findProduct = async ({ product_id, unSelect }) => {
    return await productModel.findById(product_id).select(ungetSelectData(unSelect)).lean();
}

export const updateProductById = async ({
    productId,
    bodyUpdate,
    model, 
    isNew = true
}) => {
    return await model.findByIdAndUpdate(productId, bodyUpdate, {
        new: isNew, // tra ve object moi sau khi update
    });
}

const queryProduct = async ({ query, limit, skip }) => {
    return await productModel.find(query)
            .populate('product_shop', 'name email')
            .sort({ updatedAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean()
            .exec()
}

export const getProductById = async (productId) => {
    return await productModel.findOne({ _id: convertToObjectIdMongodb(productId) }).lean();
}

export const checkProductByServer = async (products) => {
    return await Promise.all(products.map(async product => {
        const foundProduct = await getProductById(product.productId);
        if (foundProduct) {
            return {
                price: foundProduct.product_price,
                quantity: product.quantity,
                productId: product.productId,
            }
        }
    }))
}