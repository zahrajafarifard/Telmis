const jwt = require("jsonwebtoken");
const axios = require("axios");

const bcrypt = require("bcryptjs");
const moment = require("jalali-moment");
var captchapng = require("captchapng");
const { Op } = require("sequelize");
const HttpError = require("../models/http-error");
const Client = require("../models/client");
const ClientAddresses = require("../models/client-address");
const ClientLoginHistory = require("../models/client-login-history");
const ClientShopNotification = require("../models/client-shop-notification");
const UAParser = require("ua-parser-js");
const sequelize = require("../db");
const path = require("path");
const fs = require("fs");

exports.fetchUser = async (req, res, next) => {
  try {
    const user = await Client.findOne({
      where: { mobile: req.mobile },
      attributes: ["id", "mobile", "name"],
    });
    if (!user) return res.status(404).json({ message: "User not found." });

    return res.status(200).json({ data: user });
  } catch (error) {
    console.error("error:", error);
    return res.status(500).json({ message: "Server error." });
  }
};
exports.resendOTP = async (req, res, next) => {
  const { mobile } = req.body;

  if (!mobile) {
    return res.status(400).json({ message: "Mobile number is required." });
  }

  try {
    const user = await Client.findOne({ where: { mobile } });
    if (!user) return res.status(404).json({ message: "User not found." });

    // Generate new OTP and expiry (2 minutes)
    const newOTP = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 2 * 60 * 1000);

    user.securityCode = newOTP;
    user.securityCodeExpireDate = expiresAt;
    await user.save();

    // Send OTP via SMS
    try {
      // await axios.get(
      //   `https://login.niazpardaz.ir/SMSInOutBox/SendSms?username=d.momeni&password=rag%23818&from=10009611&to=${mobile}&text=کد اعتبار سنجی شما: ${newOTP}`
      // );

      return res
        .status(200)
        .json({ message: "OTP resent to your mobile.", newOTP });
    } catch (smsError) {
      console.error("SMS sending failed:", smsError);
      return next(
        new HttpError("خطا در ارسال پیامک. لطفاً دوباره تلاش کنید.", 500)
      );
    }
  } catch (err) {
    console.error("Resend OTP error:", err);
    return res.status(500).json({ message: "Server error." });
  }
};

exports.verifyOTP = async (req, res, next) => {
  const { mobile, password: otpCode } = req.body;

  if (!mobile || !otpCode)
    return res
      .status(400)
      .json({ message: "Mobile and OTP code are required." });

  try {
    const user = await Client.findOne({ where: { mobile } });
    if (!user) return res.status(404).json({ message: "User not found." });

    const isOtpExpired = new Date(user.securityCodeExpireDate) < new Date();
    const isOtpInvalid = user.securityCode !== otpCode;

    console.log(isOtpExpired, isOtpInvalid);

    if (isOtpInvalid || isOtpExpired) {
      // user.securityCodeCounter += 1;
      // await user.save();
      return res.status(401).json({ message: "Invalid or expired OTP." });
    }

    // Optional: Clear OTP after successful verification
    user.securityCode = null;
    user.securityCodeExpireDate = null;
    await user.save();

    const token = jwt.sign(
      { clientId: user.id, mobile: user.mobile },
      "mySecretKey :) "
      // { expiresIn: "10h" }
    );

    return res
      .status(200)
      .json({ message: "Authenticated successfully.", token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
};

exports.signInUp = async (req, res, next) => {
  const { name, mobile } = req.body;

  if (!name || !mobile) {
    return res.status(400).json({ message: "Name and mobile are required." });
  }

  try {
    let user = await Client.findOne({ where: { mobile } });

    if (!user) {
      user = await Client.create({ name, mobile });
    }

    // Generate a 6-digit OTP and expiry time (5 mins)
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 2 * 60 * 1000);

    // Save OTP to user
    user.securityCode = otpCode;
    user.securityCodeExpireDate = otpExpiry;
    await user.save();

    // password is rag#818 but code for # is %23
    let sms;
    try {
      // sms = await axios.get(
      //   `https://login.niazpardaz.ir/SMSInOutBox/SendSms?username=d.momeni&password=rag%23818&from=10009611&to=${mobile}&text=کد اعتبار سنجی شما: ${code}`
      // );
    } catch (error) {
      console.log("errrrr:", error);
      return next(new HttpError("خطای سمت سرور ، لطفا مجددا تلاش کنید.", 500));
    }

    return res.status(200).json({ data: otpCode });
  } catch (err) {
    console.error("Server error:", err);
    return res.status(500).json({ message: "Server error." });
  }
};

exports.getLatestNotification = async (req, res, next) => {
  let _notif;

  try {
    _notif = await ClientShopNotification.findAll({
      where: {
        ClientId: req.userId,
      },
      limit: 6,
      include: [{ model: Client }],
      order: [["createdAt", "DESC"]],
    });
  } catch (error) {
    return next(new HttpError("An error occured, try again later", 500));
  }

  return res.status(200).json({ data: _notif });
};

exports.getNotification = async (req, res, next) => {
  let _notif;
  const { page, pageSize } = req.body;

  offset = (page - 1) * pageSize;
  limit = pageSize;

  const twoMonthsAgo = new Date();
  twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);

  try {
    _notif = await ClientShopNotification.findAndCountAll({
      limit,
      offset,
      where: {
        ClientId: req.userId,
        createdAt: {
          [Op.gte]: twoMonthsAgo,
        },
      },
      include: [{ model: Client }],
      order: [["createdAt", "DESC"]],
    });
  } catch (error) {
    return next(new HttpError("An error occured, try again later", 500));
  }

  return res.status(200).json({ data: _notif });
};

exports.getClient = async (req, res, next) => {
  let _client;

  try {
    _client = await Client.findByPk(req.userId, {
      attributes: ["name", "mobile", "image", "resume", "isResumeSentToAdmin"],
    });
  } catch (error) {
    return next(
      new HttpError("خطای ورود به حساب کاربری ، لطفا بعدا تلاش کنید .", 500)
    );
  }
  return res.status(200).json({ data: _client });
};
exports.deleteAddress = async (req, res, next) => {
  const { id } = req.params;

  console.log("iiiiiiiiiiiii", id);

  if (!id) {
    return res.status(400).send("Missing address ID.");
  }

  try {
    const address = await ClientAddresses.findByPk(id);
    if (!address) {
      return res.status(404).json({ error: "Address not found." });
    }

    // Optional: Check for dependent records in related table(s)
    // Example: check if any orders reference this address
    // const ordersUsingAddress = await Order.findOne({ where: { addressId: id } });
    // if (ordersUsingAddress) {
    //   return res.status(409).json({ error: "Address is in use and cannot be deleted." });
    // }

    await address.destroy();
    return res.status(200).json({ message: "Address deleted successfully." });
  } catch (error) {
    console.error("Delete error:", error);

    // Foreign key constraint error (MySQL-specific code)
    if (error.name === "SequelizeForeignKeyConstraintError") {
      return res
        .status(409)
        .json({ error: "Cannot delete: address is in use." });
    }

    return res.status(500).json({ error: "Internal server error." });
  }
};

exports.insertAddress = async (req, res, next) => {
  const { address } = req.body;

  try {
    if (!req.userId) {
      return res
        .status(403)
        .json({ error: "Unauthorized to edit this address." });
    }

    const createdAddress = await ClientAddresses.create({
      address: address.address,
      city: address.city,
      province: address.province,
      neighbourhood: address.neighbourhood,
      postalCode: address.postalCode,
      buildingNumber: address.buildingNumber,
      unit: address.unit,
      addressName: address.addressName,
      ClientId: req.userId,
    });

    return res.status(201).json({ data: createdAddress });
  } catch (error) {
    console.log("eee", error);

    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(403).json({ error: "SequelizeUniqueConstraintError" });
    }
    return res.status(500).json({ error: "Internal server error." });
  }
};
exports.editAddresses = async (req, res, next) => {
  const { address } = req.body;

  try {
    const existingAddress = await ClientAddresses.findByPk(address.id);

    if (!existingAddress) {
      return res.status(404).json({ error: "Address not found." });
    }

    if (existingAddress.ClientId !== req.userId) {
      return res
        .status(403)
        .json({ error: "Unauthorized to edit this address." });
    }

    const updatedAddress = await existingAddress.update({
      address: address.address,
      city: address.city,
      province: address.province,
      neighbourhood: address.neighbourhood,
      postalCode: address.postalCode,
      buildingNumber: address.buildingNumber,
      unit: address.unit,
      addressName: address.addressName,
    });

    return res.status(200).json({ data: updatedAddress });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error." });
  }
};

exports.getAddress = async (req, res, next) => {
  let _address;

  const { addressId } = req.params;

  try {
    _address = await ClientAddresses.findByPk(addressId);
  } catch (error) {
    console.log("eeee", error);
  }

  return res.status(200).json({ data: _address });
};
exports.getAddresses = async (req, res, next) => {
  let _addresses;
  try {
    _addresses = await ClientAddresses.findAll({
      where: {
        ClientId: req.userId,
      },
      order: [["createdAt", "DESC"]],
    });
  } catch (error) {
    console.log("eeee", error);
  }

  return res.status(200).json({ data: _addresses });
};

exports.regenerateCapcha = async (req, res, next) => {
  const { mobile } = req.body;
  let randomNumber = parseInt(Math.random() * 90000 + 10000);
  var p = new captchapng(90, 32, randomNumber); // width,height,numeric captcha
  p.color(192, 192, 192, 255); // First color: background (red, green, blue, alpha)
  p.color(0, 0, 0, 255); // Second color: paint (red, green, blue, alpha)

  var img = p.getBase64();
  var imgbase64 = new Buffer.alloc(img.length, img, "base64");

  const _customer = await Client.findOne({ where: { mobile: mobile } });
  if (_customer) {
    _customer.securityCode = randomNumber;
    await _customer.save();
  }
  return res.status(200).json({ capcha: imgbase64 });
};

// exports.checkMobile = async (req, res, next) => {
//   const { mobile } = req.body;
//   let _randomPassword = "",
//     _hashedPassword;

//   let existingClient;
//   try {
//     existingClient = await Client.findOne({ where: { mobile } });
//   } catch (err) {
//     return next(
//       new HttpError("خطای ورود به حساب کاربری ، لطفا بعدا تلاش کنید .", 500)
//     );
//   }

//   let randomNumber = parseInt(Math.random() * 90000 + 10000);

//   var p = new captchapng(90, 32, randomNumber); // width,height,numeric captcha
//   p.color(192, 192, 192, 255); // First color: background (red, green, blue, alpha)
//   p.color(0, 0, 0, 255); // Second color: paint (red, green, blue, alpha)

//   var img = p.getBase64();
//   var imgbase64 = new Buffer.alloc(img.length, img, "base64");

//   ///////////////////////////////////////////////
//   for (let i = 0; i < 6; i++) {
//     const randomType = Math.floor(Math.random() * 3);
//     if (randomType === 0) {
//       _randomPassword += String.fromCharCode(
//         65 + Math.floor(Math.random() * 26)
//       );
//     } else if (randomType === 1) {
//       _randomPassword += String.fromCharCode(
//         97 + Math.floor(Math.random() * 26)
//       );
//     } else {
//       _randomPassword += Math.floor(Math.random() * 10);
//     }
//   }

//   try {
//     _hashedPassword = await bcrypt.hash(_randomPassword, 12);
//   } catch (err) {
//     console.log("error", err);
//     return next(new HttpError("An error occured, please try again.", 500));
//   }
//   ///////////////////////////////////////////////

//   let today = new Date();
//   let tenMins = new Date(today.getTime() + 10 * 60 * 1000);
//   const _now = moment(new Date());

//   const _securityCodeExpireDate = moment(
//     existingClient?.securityCodeExpireDate
//   );

//   if (!existingClient) {
//     // return next(new HttpError("لطفا ابتدا حساب کاربری خود را ایجاد کنید", 407));
//     return next(new HttpError("لطفا ابتدا حساب کاربری خود را ایجاد کنید", 404));
//   }

//   if (existingClient) {
//     existingClient.ticket = _hashedPassword;
//     existingClient.ticketExpireDate = tenMins;

//     existingClient.securityCode = randomNumber;

//     existingClient.securityCodeExpireDate =
//       _securityCodeExpireDate.diff(_now, "second") > 0 &&
//       existingClient.securityCodeCounter > 3
//         ? existingClient.securityCodeExpireDate
//         : tenMins;

//     await existingClient.save();

//     // password is rag#818 but code for # is %23
//     let sms;
//     try {
//       // sms = await axios.get(
//       //   `https://login.niazpardaz.ir/SMSInOutBox/SendSms?username=d.momeni&password=rag%23818&from=10009611&to=${mobile}&text=کد اعتبار سنجی شما: ${_randomPassword}`
//       // );
//     } catch (error) {
//       console.log("errrrr:", error);

//       return next(new HttpError("خطای سمت سرور ، لطفا مجددا تلاش کنید.", 500));
//     }
//   }

//   return res.status(200).json({
//     pass: _randomPassword,
//     capcha: imgbase64,
//     mobile: existingClient.mobile,
//   });
// };

// exports.signIn = async (req, res, next) => {
//   const { mobile, sms, capcha } = req.body;

//   let existingClient;
//   try {
//     existingClient = await Client.findOne({ where: { mobile } });
//   } catch (err) {
//     return next(
//       new HttpError("خطای ورود به حساب کاربری، لطفا دوباره تلاش کنید", 500)
//     );
//   }

//   if (!existingClient) {
//     return next(new HttpError("لطفا ابتدا حساب کاربری خود را ایجاد کنید", 407));
//   }
//   const _now = moment(new Date());
//   const _ticketExpireDate = moment(existingClient?.ticketExpireDate);
//   const _securityCodeExpireDate = moment(
//     existingClient?.securityCodeExpireDate
//   );

//   if (
//     existingClient.securityCodeCounter >= 3 &&
//     _securityCodeExpireDate.diff(_now, "second") < 0
//   ) {
//     existingClient.securityCodeCounter = 0;
//     await existingClient.save();
//   }

//   if (existingClient.securityCodeCounter > 3) {
//     return res.status(429).json({
//       msg: "Your account has been suspended for a while... Try later",
//     });
//   }

//   if (
//     _securityCodeExpireDate.diff(_now, "second") > 0 &&
//     existingClient.securityCodeCounter <= 3
//   ) {
//     existingClient.securityCodeCounter = existingClient.securityCodeCounter + 1;
//     await existingClient.save();
//   }

//   if (_securityCodeExpireDate.diff(_now, "second") < 0) {
//     return res.status(423).json({
//       msg: " کد امنیتی منقضی شده است",
//     });
//   }

//   if (_ticketExpireDate.diff(_now, "second") < 0) {
//     return res.status(423).json({
//       msg: " کد امنیتی منقضی شده است",
//     });
//   }

//   let unhashedTicket = await bcrypt.compare(sms, existingClient.ticket);

//   if (!unhashedTicket || existingClient.securityCode !== capcha) {
//     return res.status(424).json({
//       msg: " کد(های) امنیتی اشتباه است",
//     });
//   }

//   let token;
//   try {
//     token = jwt.sign(
//       { clientId: existingClient.id, mobile: existingClient.mobile },
//       "mySecretKey :) ",
//       { expiresIn: "10h" }
//     );
//   } catch (err) {
//     return next(
//       new HttpError("خطای ورود به حساب کاربری ، لطفا دوباره تلاش کنید ", 500)
//     );
//   }

//   const _ip =
//     req.headers["x-forwarded-for"] || req.socket.remoteAddress || req.ip;

//   const parser = new UAParser();
//   const ua = req.get("User-Agent");
//   const browserInfo = parser.setUA(ua).getBrowser();
//   const osInfo = parser.setUA(ua).getOS();
//   let _device = browserInfo.name + " " + " On " + osInfo.name;

//   try {
//     await ClientLoginHistory.create({
//       ClientId: existingClient.id,
//       login: new Date(),
//       ip: _ip,
//       device: _device,
//     });
//   } catch (error) {
//     return next(new HttpError("An error occured, please try again", 500));
//   }

//   if (
//     unhashedTicket &&
//     existingClient.securityCode === capcha &&
//     _ticketExpireDate.diff(_now, "second") > 0 &&
//     _securityCodeExpireDate.diff(_now, "second") > 0
//   ) {
//     existingClient.securityCodeCounter = 0;
//     await existingClient.save();

//     return res.status(200).json({
//       // clientId: existingClient.id,
//       resume: existingClient.resume,
//       isResumeSentToAdmin: existingClient.isResumeSentToAdmin,
//       mobile: existingClient.mobile,
//       token: token,
//     });
//   } else {
//     return next(new HttpError("An error occured, please try again", 500));
//   }

//   // return res.status(200).json({
//   //   clientId: existingClient.id,
//   //   mobile: existingClient.mobile,
//   //   token: token,
//   // });
// };

// exports.signUp = async (req, res, next) => {
//   const { name, mobile } = req.body;

//   let existingClient;
//   try {
//     existingClient = await Client.findOne({ where: { mobile } });
//   } catch (err) {
//     return next(
//       new HttpError("خطا در ایجاد حساب کاربری ، لطفا بعدا تلاش کنید", 500)
//     );
//   }

//   if (existingClient) {
//     return next(new HttpError("شماره موبایل وارد شده تکراری می باشد .", 422));
//   }

//   await Client.create({
//     mobile,
//     name,
//   });

//   return res.status(201).json({
//     msg: "Registration was succcessful.",
//   });
// };

// exports.regenerateCredentials = async (req, res, next) => {
//   const { mobile } = req.body;

//   let _randomPassword = "";
//   let _hashedPassword;

//   if (!mobile) {
//     return res.status(400).send("Request body is missing or empty");
//   }

//   for (let i = 0; i < 6; i++) {
//     const randomType = Math.floor(Math.random() * 3);
//     if (randomType === 0) {
//       // Add a random uppercase letter
//       _randomPassword += String.fromCharCode(
//         65 + Math.floor(Math.random() * 26)
//       );
//     } else if (randomType === 1) {
//       // Add a random lowercase letter
//       _randomPassword += String.fromCharCode(
//         97 + Math.floor(Math.random() * 26)
//       );
//     } else {
//       // Add a random digit
//       _randomPassword += Math.floor(Math.random() * 10);
//     }
//   }

//   try {
//     _hashedPassword = await bcrypt.hash(_randomPassword, 12);
//   } catch (err) {
//     console.log("error", err);

//     return next(new HttpError("An error occured, please try again.", 500));
//   }

//   let _foundClient = await Client.findOne({
//     where: {
//       mobile: mobile,
//     },
//   });

//   if (!_foundClient) {
//     return next(new HttpError("Client not found", 404));
//   }

//   let today = new Date();
//   let twoMins = new Date(today.getTime() + 2 * 60 * 1000);

//   try {
//     _foundClient.ticket = _hashedPassword;
//     _foundClient.ticketExpireDate = twoMins;

//     await _foundClient.save();
//   } catch (error) {
//     console.log("error", error);

//     return next(new HttpError("An error occured, try again later", 500));
//   }

//   let sms;

//   try {
//     sms = await axios.get(
//       `https://login.niazpardaz.ir/SMSInOutBox/SendSms?username=d.momeni&password=rag%23818&from=10009611&to=${mobile}&text= موبایل: ${mobile} %0A رمز عبور: ${_randomPassword}`
//     );
//   } catch (error) {
//     return next(new HttpError("An error occured, try again later", 500));
//   }
//   return res.status(200).json({
//     mobile: mobile,
//     password: _randomPassword,
//   });
// };

// exports.regenerateCapcha = async (req, res, next) => {
//   const { mobile } = req.body;

//   if (!mobile) {
//     return res.status(400).send("Request body is missing or empty");
//   }

//   let randomNumber = parseInt(Math.random() * 90000 + 10000);
//   var p = new captchapng(90, 32, randomNumber); // width,height,numeric captcha
//   p.color(192, 192, 192, 255); // First color: background (red, green, blue, alpha)
//   p.color(0, 0, 0, 255); // Second color: paint (red, green, blue, alpha)

//   var img = p.getBase64();
//   var imgbase64 = new Buffer.alloc(img.length, img, "base64");

//   let today = new Date();
//   let tenMins = new Date(today.getTime() + 10 * 60 * 1000);
//   let _foundClient;
//   try {
//     _foundClient = await Client.findOne({
//       where: { mobile: mobile },
//     });
//   } catch (error) {
//     return next(new HttpError("Client not found", 500));
//   }

//   if (!_foundClient) {
//     return next(new HttpError("Client not found", 404));
//   }

//   if (_foundClient) {
//     try {
//       _foundClient.securityCode = randomNumber;
//       _foundClient.securityCodeExpireDate = tenMins;
//       await _foundClient.save();
//     } catch (error) {
//       return next(new HttpError("Client not found", 500));
//     }
//   }

//   return res.status(200).json({ capcha: imgbase64 });
// };

exports.getUserWithLoginHistory = async (req, res, next) => {
  const { page, pageSize } = req.body;

  offset = (page - 1) * pageSize;
  limit = pageSize;

  const _clientId = req.userId;

  let _foundClient, _foundHistory;

  _foundClient = await Client.findByPk(_clientId);

  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  try {
    _foundHistory = await ClientLoginHistory.findAndCountAll({
      limit,
      offset,
      where: {
        ClientId: _clientId,
        createdAt: {
          [Op.gte]: sixMonthsAgo,
        },
      },

      order: [["createdAt", "DESC"]],
    });
  } catch (error) {
    console.log(error);
    return next(new HttpError("An error occured, try again later", 500));
  }

  return res
    .status(200)
    .json({ client: _foundClient, loginHistory: _foundHistory });
};

exports.update = async (req, res, next) => {
  const _session = await sequelize.transaction();
  const { name, mobile } = req.body;

  let _oldMobile;

  if (!name || !mobile) {
    return res
      .status(400)
      .json({ message: "Request body is missing or incomplete" });
  }

  try {
    const _foundClient = await Client.findByPk(req.userId, {
      transaction: _session,
    });

    _oldMobile = _foundClient?.mobile;
    if (!_foundClient) {
      await _session.rollback();
      return next(new HttpError("No client found", 404));
    }
    let oldImagePath;

    if (_foundClient?.image) {
      oldImagePath = path.join(
        __dirname,
        "..",
        "uploads",
        path.basename(_foundClient.image)
      );
    }

    _foundClient.name = name;
    _foundClient.mobile = mobile;
    _foundClient.image = req.files?.image && req.files?.image[0]?.path;

    await _foundClient.save({
      transaction: _session,
    });

    if (_foundClient?.image) {
      try {
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
          console.log("Old image deleted successfully");
        }
      } catch (err) {
        console.error("Error deleting old image:", err);
      }
    }

    await _session.commit();

    return res.status(200).json({ data: _foundClient, oldMobile: _oldMobile });
  } catch (error) {
    await _session.rollback();

    const statusCode =
      error?.name === "SequelizeUniqueConstraintError" ? 403 : 500;
    return next(
      new HttpError(
        "An error occurred while updating client, try again later",
        statusCode
      )
    );
  }
};
