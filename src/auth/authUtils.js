"use strict";
import jwt from "jsonwebtoken";
import { asyncHandler } from "../helpers/asyncHandler.js";
import { AuthFailureError, NotFoundError } from "../core/error.response.js";
import KeyTokenService  from "../services/keyToken.service.js";

const HEADER = {
  API_KEY: "x-api-key",
  CLIENT_ID: 'x-client-id',
  AUTHORIZATION: "authorization",
};

export const createTokenPair = async (payload, publicKey, privateKey) => {
  try {
    // access token
    const accessToken = await jwt.sign(payload, privateKey, {
      algorithm: "RS256",
      expiresIn: "2 days",
    });

    // refresh token
    const refreshToken = await jwt.sign(payload, privateKey, {
      algorithm: "RS256",
      expiresIn: "7 days",
    });

    //
    jwt.verify(accessToken, publicKey, (err, decode) => {
      if (err) {
        console.error(`error verify::`, err);
      } else {
        console.log(`decode verify::`, decode);
      }
    });
    return { accessToken, refreshToken };
  } catch (error) {}
};

export const authentication = asyncHandler( async (req, res, next) => {
  /*
    1 - Check userId missing ?
    2 - Get accessToken 
    3 - verify token
    4 - check user in dbs ?
    5 - check keyStore with this userId ?
    6 - OK all => return next()
  */

    // 1 - Kiểm tra xem client có gửi userId không (qua header CLIENT_ID)
    // Mục đích: xác định xem ai đang gửi request đến 
  const userId = req.headers[HEADER.CLIENT_ID];
  if (!userId) throw new AuthFailureError('Invalid Request 1');

  // 2 - Dựa vào userId, tìm kiếm trong CSDL một bản ghi chứa publicKey 
  // Mục đích: dùng để xác minh tính hợp lệ  của JWT bằng publicKey 
  const keyStore = await KeyTokenService.findByUserId(userId);
  if (!keyStore) throw new NotFoundError('Not found keyStore');

  // 3 - Kiểm tra xem client có gửi accessToken không (qua header AUTHORIZATION)
  // Mục đích: Token này sẽ được dùng để xác thực danh tính 
  const accessToken = req.headers[HEADER.AUTHORIZATION];
  if (!accessToken) throw new AuthFailureError('Invalid Request 2');

  try {
    // Dùng JWT để xác thực token với publicKey từ keyStore 
    const decodeUser = jwt.verify(accessToken, keyStore.publicKey);
    if (userId != decodeUser.userId) throw new AuthFailureError('Invalid User');
    // dùng để đưa keyStore theo authentication để sử dụng trong các middleware khác
    req.keyStore = keyStore;
    return next(); 
  } catch (err) {
    throw err;
  }
})