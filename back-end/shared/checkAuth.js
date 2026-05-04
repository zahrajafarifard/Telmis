const jwt = require("jsonwebtoken");
const HttpError = require("../models/http-error");
module.exports = async (req, res, next) => {
  if (req.method === "OPTION") {
    return next();
  }
  try {
    let decodedToken;
    let token = req.header("Authorization")?.split(" ")[1];

    

    if (!token) {
      return next(new HttpError("Login failed11, try again.", 401));
    }

    decodedToken = jwt.verify(token, "mySecretKey :) ");

    if (!decodedToken) {
      if (!token) {
        return next(new HttpError("Login failed22, try again.", 401));
      }
    }

    req.userId = await decodedToken.clientId;
    req.mobile = await decodedToken.mobile;

    next();
  } catch (err) {
    console.log("eeee", err);

    return next(new HttpError("ابتدا به حساب کاربری خود وارد شوید .", 401));
  }
};
