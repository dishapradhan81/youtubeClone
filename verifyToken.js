import jwt from "jsonwebtoken";
import { createError } from "./error.js";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) return next(createError(401, "You are not authenticated!"));

  jwt.verify(token, process.env.JWT_SECRET_TOKEN, (err, data) => {
    if (err) return next(createError(403, "Token is not valid!"));
    //if everything is ok
    req.data = data;

    next();
  });
};
