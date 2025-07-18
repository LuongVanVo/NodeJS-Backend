"use strict";

import productModel, {
  clothingModel,
  electronicModel,
  furnitureModel,
} from "../models/product.model.js";
import { BadRequestError } from "../core/error.response.js";
import { 
  findAllDraftsForShop, 
  publishProductByShop, 
  findAllPublishForShop, 
  unPublishProductByShop, 
  searchProductByUser,
  findAllProducts,
  findProduct,
  updateProductById
} from "../models/repositories/product.repo.js";
import { removeUndefinedObject, updateNestedObjectParser } from "../ultis/index.js";
import { insertInventory } from "../models/repositories/inventory.repo.js";

// define Factory class to create product
class ProductFactory {
  /* 
        type: 'Clothing',
        payload
    */
  static productRegistry = {} // key - class

  static registerProductType(type, classRef) {
    ProductFactory.productRegistry[type] = classRef;
  }

  static async createProduct(type, payload) {
    const productClass = ProductFactory.productRegistry[type];
    if (!productClass) throw new BadRequestError(`Invalid Product Types ${type}`);

    return new productClass(payload).createProduct();
  }

  static async updateProduct(type, productId, payload) {
    const productClass = ProductFactory.productRegistry[type];
    if (!productClass) throw new BadRequestError(`Invalid Product Types ${type}`);

    return new productClass(payload).updateProduct(productId);
  }

  // PUT //
  static async publishProductByShop({ product_shop, product_id }) {
    return await publishProductByShop({ product_shop, product_id });
  }

  static async unPublishProductByShop({ product_shop, product_id }) {
    return await unPublishProductByShop({ product_shop, product_id });
  }
  // END PUT //

  // query 
  static async findAllDraftsForShop({ product_shop, limit = 50, skip = 0}) {
    const query = { product_shop, isDraft: true };
    return await findAllDraftsForShop({ query, limit, skip });
  }

  static async findAllPublishForShop({ product_shop, limit = 50, skip = 0 }) {
    const query = { product_shop, isPublished: true };
    return await findAllPublishForShop({ query, limit, skip });
  }

  static async searchProductByUser({ keySearch }) {
    return await searchProductByUser({ keySearch });
  }

  static async findAllProducts({ limit = 50, sort = 'ctime', page = 1, filter = { isPublished: true } }) {
    return await findAllProducts({ limit, sort, page, filter, 
      select: ['product_name', 'product_price', 'product_thumb', 'product_shop']
     });
  }

  static async findProduct({ product_id }) {
    return await findProduct({ product_id, unSelect: ['__v', 'product_variation'] });
  }
}

// define base product class
class Product {
  constructor({
    product_name,
    product_thumb,
    product_description,
    product_price,
    product_quantity,
    product_type,
    product_shop,
    product_attributes,
  }) {
    this.product_name = product_name;
    this.product_thumb = product_thumb;
    this.product_description = product_description;
    this.product_price = product_price;
    this.product_quantity = product_quantity;
    this.product_type = product_type;
    this.product_shop = product_shop;
    this.product_attributes = product_attributes;
  }
  // create new product
  async createProduct(product_id) {
    const newProduct = await productModel.create({ ...this, _id: product_id });
    if (newProduct) {
      // add product_stock into inventory collection
      await insertInventory({ 
        productId: newProduct._id,
        shopId: this.product_shop,
        stock: this.product_quantity,
      })
    } 
    return newProduct;
  }
  // update product
  async updateProduct(productId, bodyUpdate) {
    return await updateProductById({ productId, bodyUpdate, model: productModel });
  }
}

// Define sub-class for different product types Clothing
class Clothing extends Product {
  async createProduct() {
    const newClothing = await clothingModel.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newClothing) throw new BadRequestError("Create new Clothing error");

    const newProduct = await super.createProduct(newClothing._id);
    if (!newProduct) throw new BadRequestError("create new Product error");

    return newProduct;
  }

  async updateProduct(productId) {
    // 1. remove attribute has null or undefined
    // console.log(`[1]::`, this);
    const objectParams = removeUndefinedObject(this);
    // console.log(`[2]::`, objectParams);
    // 2. check xem update o cho nao ?
    if (objectParams.product_attributes) {
      // update child
      await updateProductById({ productId, bodyUpdate: updateNestedObjectParser(objectParams.product_attributes), model: clothingModel });
    }
    // update product
    const updateProduct = await super.updateProduct(productId, updateNestedObjectParser(objectParams));
    return updateProduct;
  }
}

// Define sub-class for different product types Electronics
class Electronic extends Product {
  async createProduct() {
    const newElectronic = await electronicModel.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newElectronic)
      throw new BadRequestError("Create new Electronic error");

    const newProduct = await super.createProduct(newElectronic._id);
    if (!newProduct) throw new BadRequestError("Create new Product error");

    return newProduct;
  }
}

// Define sub-class for different product types Electronics
class Furniture extends Product {
  async createProduct() {
    const newFurniture = await furnitureModel.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newFurniture)
      throw new BadRequestError("Create new Electronic error");

    const newProduct = await super.createProduct(newFurniture._id);
    if (!newProduct) throw new BadRequestError("Create new Product error");

    return newProduct;
  }
}

// register product type
ProductFactory.registerProductType('Clothing', Clothing);
ProductFactory.registerProductType('Electronics', Electronic);
ProductFactory.registerProductType('Furniture', Furniture);

export default ProductFactory;
