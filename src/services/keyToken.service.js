"use strict";

import keytokenModel from "../models/keytoken.model.js";

class KeyTokenService {
  static createKeyToken = async ({ userId, publicKey, privateKey, refreshToken }) => {
    try {
      // const publicKeyString = publicKey.toString();
      // const tokens = await keytokenModel.create({
      //   user: userId,
      //   publicKey: publicKeyString,
      // });

      // return tokens ? tokens.publicKey : null;

      // level xxx
      const filter = { user: userId };
      const update = {
        publicKey,
        privateKey,
        refreshTokenUsed: [],
        refreshToken,
      };
      const options = { upsert: true, new: true };

      const tokens = await keytokenModel.findOneAndUpdate(
        filter,
        update,
        options
      );

      return tokens ? tokens.publicKey : null;
    } catch (error) {
      return error;
    }
  };
}

export default KeyTokenService;
