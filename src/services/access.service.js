"use strict";

import shopModel from "../models/shop.model.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import KeyTokenService from "./keyToken.service.js";
import { createTokenPair } from "../auth/authUtils.js";
import { getInfoData } from "../ultis/index.js";

const RoleShop = {
  SHOP: "SHOP",
  WRITER: "WRITER",
  EDITOR: "EDITOR",
  ADMIN: "ADMIN",
};

const SALT_ROUND = 10;

class AccessService {
  static signUp = async ({ name, email, password }) => {
    try {
      // step1: check email exists ??
      const holderShop = await shopModel.findOne({ email }).lean(); // lean help query faster
      if (holderShop) {
        return {
          code: "xxxx",
          message: "Shop already registered !!!",
        };
      }
      // hash password
      const passwordHash = await bcrypt.hash(password, SALT_ROUND);
      const newShop = await shopModel.create({
        name,
        email,
        password: passwordHash,
        role: [RoleShop.SHOP],
      });

      if (newShop) {
        // created privateKey: not save into system (sign token), publicKey: save into DB (verify token)
        const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
          modulusLength: 4096,
          publicKeyEncoding: {
            type: "pkcs1", // public key CryptorGraphy Standards 1
            format: "pem",
          },
          privateKeyEncoding: {
            type: "pkcs1",
            format: "pem",
          },
        });

        console.log({ privateKey, publicKey }); // save collection KeyStore

        const publicKeyString = await KeyTokenService.createKeyToken({
          userId: newShop._id,
          publicKey,
        });

        if (!publicKeyString) {
          return {
            code: "xxxx",
            message: "publicKeyString error",
          };
        }

        const publicKeyObject = crypto.createPublicKey(publicKeyString);
        console.log(`publicKeyObject::`, publicKeyObject);
        // created token pair
        const tokens = await createTokenPair(
          { userId: newShop._id, email },
          publicKeyString,
          privateKey
        );
        console.log(`Created Token Success::`, tokens);
        return {
          code: 201,
          metadata: {
            shop: getInfoData({ fileds: ['_id', 'name', 'email'], object: newShop}),
            tokens,
          },
        };
      }
      return {
        code: 200,
        metadata: null,
      };
    } catch (error) {
      return {
        code: "xxx",
        message: error.message,
        status: "error",
      };
    }
  };
}

export default AccessService;
