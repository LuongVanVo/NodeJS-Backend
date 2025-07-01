"use strict";

import { findById } from "../services/apikey.service.js";
const HEADER = {
  API_KEY: "x-api-key",
  AUTHORIZATION: "authorization",
};

export const apiKey = async (req, res, next) => {
  try {
    const key = req.headers[HEADER.API_KEY]?.toString();
    if (!key) {
      return res.status(403).send({
        message: "Forbidden Error",
      });
    }

    // check objKey
    const objectKey = await findById(key);
    if (!objectKey) {
      return res.status(403).send({
        message: "Forbidden Error",
      });
    }
    req.objectKey = objectKey;
    return next();
  } catch (err) {
    console.log(err);
    next(err);
  }
};

export const permission = (permission) => {
  return (req, res, next) => {
    if (!req.objectKey.permissions) {
      return res.status(403).send({
        message: "Forbidden denied",
      });
    }

    console.log("permissions::", req.objectKey.permissions);
    const validPermission = req.objectKey.permissions.includes(permission);
    if (!validPermission) {
      return res.status(403).send({
        message: "Forbidden denied",
      });
    }

    return next();
  };
};
