"use-strict";

import mongoose, { Schema } from "mongoose";
import slugify from "slugify";

const DOCUMENT_NAME = "Product";
const COLLECTION_NAME = "Products";

const productSchema = new Schema(
  {
    product_name: { type: String, required: true },
    product_thumb: { type: String, required: true },
    product_description: String,
    product_slug: String,
    product_price: { type: Number, required: true },
    product_quantity: { type: Number, required: true },
    product_type: {
      type: String,
      required: true,
      enum: ["Electronics", "Clothing", "Furniture"],
    },
    product_shop: { type: Schema.Types.ObjectId, ref: "Shop" },
    product_attributes: { type: Schema.Types.Mixed, required: true },
    // more 
    product_ratingsAverage: {
      type: Number, 
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
      set: (val) =>  Math.round(val * 10) / 10
    },
    product_variation: { type: Array, default: [] },
    isDraft: { type: Boolean, default: true, index: true, select: false },
    isPublished: { type: Boolean, default: false, index: true, select: false }
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);

// create index for search 
productSchema.index({ product_name: 'text', product_description: 'text'});

// document middleware: runs before .save() and .create() ...
// Hàm này sẽ chạy trước khi lưu sản phẩm vào database
// dùng để tạo slug cho sản phẩm 
productSchema.pre('save', function (next) {
  this.product_slug = slugify(this.product_name, {
    lower: true
  });
  next();
})

// define the product type = clothing
const clothingSchema = new Schema(
  {
    brand: { type: String, required: true },
    size: String,
    material: String,
    product_shop: { type: Schema.Types.ObjectId, ref: 'Shop' }
  },
  {
    collection: "clothes",
    timestamps: true,
  }
);

// define the product type = electronic
const electronicSchema = new Schema(
  {
    manufacturer: { type: String, required: true },
    model: String,
    color: String,
    product_shop: { type: Schema.Types.ObjectId, ref: 'Shop' }
  },
  {
    collection: "electronics",
    timestamps: true,
  }
);

// define the product type = furniture
const furnitureSchema = new Schema(
  {
    brand: { type: String, required: true },
    size: String,
    material: String,
    product_shop: { type: Schema.Types.ObjectId, ref: 'Shop' }
  },
  {
    collection: "furnitures",
    timestamps: true,
  }
);

const clothingModel = mongoose.model("Clothing", clothingSchema);
const electronicModel = mongoose.model("Electronic", electronicSchema);
const furnitureModel = mongoose.model("Furniture", furnitureSchema);

export default mongoose.model(DOCUMENT_NAME, productSchema);
export { clothingModel, electronicModel, furnitureModel };
