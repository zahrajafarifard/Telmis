const axios = require("axios");
const io = require("../socket");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");
const moment = require("jalali-moment");
const UAParser = require("ua-parser-js");
const sequelize = require("../db");

const fs = require("fs");
const path = require("path");

const HttpError = require("../models/http-error");
const Exchange = require("../models/exchange");
const ExchangeFile = require("../models/exchange-files");
const ExchangeLoginHistory = require("../models/login-history");
const NewUserNotification = require("../models/new-user-notification");
const ExchangeNotification = require("../models/exchange-notification");
const Receipt = require("../models/receipt");
const FileType = require("../models/fileType");
const FinancialNotification = require("../models/financial-notification");
const ProfileNotification = require("../models/profile-notification");
const Product = require("../models/product");
const favoriteProduct = require("../models/favorite-products");
const ProductComment = require("../models/product-comment");
const Factor = require("../models/factor");
const ClientAddress = require("../models/client-address");
const TimeSlot = require("../models/timeSlot");
const StatusFactor = require("../models/status-factor");
const FactorDetails = require("../models/factor-details");
const DaysOfYear = require("../models/daysOfYear");
const Client = require("../models/client");
const ProductSpecification = require("../models/product-specification");
const ProductVariable = require("../models/product-variable");
const ProductVariableItem = require("../models/product-variable-items");
const FactorDetailMeta = require("../models/factor-details-meta");

exports.getFactor = async (req, res, next) => {
  let _factor;
  const { factorId } = req.params;

  try {
    _factor = await Factor.findAll({
      where: { ClientId: req.userId, id: factorId },
      include: [
        {
          model: ClientAddress,
        },
        {
          model: Client,
          attributes: ["name", "mobile"],
        },
        {
          model: TimeSlot,
          attributes: ["startTime"],
          include: [
            { model: DaysOfYear, attributes: ["shippingCost", "slotDuration"] },
          ],
        },
        {
          model: StatusFactor,
          attributes: ["id", "status", "color", "bgColor"],
        },
        {
          model: FactorDetails,
          include: [
            {
              model: FactorDetailMeta,
            },
          ],
        },
      ],
      distinct: true,
    });
  } catch (error) {
    console.log("eeeeee", error);

    return next(new HttpError("خطای سمت سرور ، لطفا مجددا تلاش کنید.", 500));
  }

  return res.status(200).json({ data: _factor });
};

exports.currentFactors = async (req, res, next) => {
  let _allFactors;

  const { page, pageSize } = req.body;

  offset = (page - 1) * pageSize;
  limit = pageSize;

  try {
    _allFactors = await Factor.findAndCountAll({
      limit,
      distinct: true,
      offset,
      where: {
        ClientId: req.userId,
        StatusFactorId: {
          [Op.notIn]: [4, 5],
        },
      },
      // attributes: {
      //   exclude: ["ClientId", "ClientAddressId"],
      // },

      include: [
        {
          model: ClientAddress,
        },
        {
          model: Client,
          attributes: ["name", "mobile"],
        },
        {
          model: TimeSlot,
          attributes: ["startTime"],
        },
        {
          model: StatusFactor,
          attributes: ["id", "status", "color", "bgColor"],
        },
        {
          model: FactorDetails,
          // include: [
          //   {
          //     model: Product,
          //     attributes: ["mainTitle", "mainImage", "price", "discount"],
          //   },
          // ],
        },
      ],
      order: [["createdAt", "DESC"]],
      distinct: true,
    });

    if (_allFactors?.count === 0) {
      return next(new HttpError("رکوردی یافت نشد .", 404));
    }
    return res.status(200).json({ data: _allFactors });
  } catch (error) {
    return next(new HttpError("خطای سمت سرور ، لطفا مجددا تلاش کنید.", 500));
  }
};
exports.getCanceledFactors = async (req, res, next) => {
  let _allFactors;

  const { page, pageSize } = req.body;

  offset = (page - 1) * pageSize;
  limit = pageSize;

  try {
    _allFactors = await Factor.findAndCountAll({
      limit,
      distinct: true,
      offset,
      where: { ClientId: req.userId, StatusFactorId: 5 }, // 5 ==> canceled
      // attributes: {
      //   exclude: ["ClientId", "ClientAddressId"],
      // },

      include: [
        {
          model: ClientAddress,
        },
        {
          model: Client,
          attributes: ["name", "mobile"],
        },
        {
          model: TimeSlot,
          attributes: ["startTime"],
        },
        {
          model: StatusFactor,
          attributes: ["id", "status", "color", "bgColor"],
        },
        {
          model: FactorDetails,
          // include: [
          //   {
          //     model: Product,
          //     attributes: ["mainTitle", "mainImage", "price", "discount"],
          //   },
          // ],
        },
      ],
      order: [["createdAt", "DESC"]],
      distinct: true,
    });

    if (_allFactors?.count === 0) {
      return next(new HttpError("رکوردی یافت نشد .", 404));
    }
    return res.status(200).json({ data: _allFactors });
  } catch (error) {
    return next(new HttpError("خطای سمت سرور ، لطفا مجددا تلاش کنید.", 500));
  }
};
exports.getDeliveredFactors = async (req, res, next) => {
  let _allFactors;

  const { page, pageSize } = req.body;

  offset = (page - 1) * pageSize;
  limit = pageSize;

  try {
    _allFactors = await Factor.findAndCountAll({
      limit,
      distinct: true,
      offset,
      where: { ClientId: req.userId, StatusFactorId: 4 }, //4 ==>delivered
      // attributes: {
      //   exclude: ["ClientId", "ClientAddressId"],
      // },

      include: [
        {
          model: ClientAddress,
        },
        {
          model: Client,
          attributes: ["name", "mobile"],
        },
        {
          model: TimeSlot,
          attributes: ["startTime"],
        },
        {
          model: StatusFactor,
          attributes: ["id", "status", "color", "bgColor"],
        },
        {
          model: FactorDetails,
          // include: [
          //   {
          //     model: Product,
          //     attributes: ["mainTitle", "mainImage", "price", "discount"],
          //   },
          // ],
        },
      ],
      order: [["createdAt", "DESC"]],
      distinct: true,
    });

    if (_allFactors?.count === 0) {
      return next(new HttpError("رکوردی یافت نشد .", 404));
    }
    return res.status(200).json({ data: _allFactors });
  } catch (error) {
    return next(new HttpError("خطای سمت سرور ، لطفا مجددا تلاش کنید.", 500));
  }
};
exports.getFactors = async (req, res, next) => {
  let _allFactors;

  console.log("rrrrrr", req.userId);

  const { page, pageSize } = req.body;

  offset = (page - 1) * pageSize;
  limit = pageSize;

  try {
    _allFactors = await Factor.findAndCountAll({
      limit,
      distinct: true,
      offset,
      where: { ClientId: req.userId },
      // attributes: {
      //   exclude: ["ClientId", "ClientAddressId"],
      // },

      include: [
        {
          model: ClientAddress,
        },
        {
          model: Client,
          attributes: ["name", "mobile"],
        },
        {
          model: TimeSlot,
          attributes: ["startTime"],
        },
        {
          model: StatusFactor,
          attributes: ["id", "status", "color", "bgColor"],
        },
        {
          model: FactorDetails,
          // include: [
          //   {
          //     model: Product,
          //     attributes: ["mainTitle", "mainImage", "price", "discount"],
          //   },
          // ],
        },
      ],
      order: [["createdAt", "DESC"]],
      distinct: true,
    });
  } catch (error) {
    console.log("eeeee", error);

    return next(new HttpError("خطای سمت سرور ، لطفا مجددا تلاش کنید.", 500));
  }

  if (_allFactors?.count === 0) {
    return next(new HttpError("رکوردی یافت نشد .", 404));
  }

  return res.status(200).json({ data: _allFactors });
};

exports.getFavorites = async (req, res, next) => {
  try {
    const { page, pageSize, sort } = req.body;
    let offset, limit;

    offset = (page - 1) * pageSize;
    limit = pageSize;

    const products = await favoriteProduct.findAndCountAll({
      where: {
        ClientId: req.userId,
      },
      limit,
      offset,
      attributes: ["id", "ClientId", "ProductId", "createdAt"],

      order: [["createdAt", sort === 2 ? "ASC" : "DESC"]],
      include: [
        {
          model: Product,

          include: [
            {
              model: ProductComment,
              attributes: ["rating"],
              where: {
                confirmedByAdmin: true,
              },
              required: false,
            },

            {
              model: ProductSpecification,
              required: false,
            },
            {
              model: ProductVariable,
              required: false,
              include: [{ model: ProductVariableItem }],
            },
          ],
        },
      ],
      distinct: true,
    });

    if (products?.count === 0) {
      return next(new HttpError("محصولی یافت نشد .", 404));
    }

    return res.status(200).json({ data: products });
  } catch (error) {
    console.log("eeee", error);

    return next(new HttpError("خطای سمت سرور ، لطفا مجددا تلاش کنید.", 500));
  }
};

// exports.getLatestNotification = async (req, res, next) => {
//   let _notif;

//   try {
//     _notif = await ExchangeNotification.findAll({
//       where: {
//         exchangeId: req.userId,
//       },
//       limit: 4,
//       include: [{ model: Exchange }],
//       order: [["createdAt", "DESC"]],
//     });
//   } catch (error) {
//     return next(new HttpError("An error occured, try again later", 500));
//   }

//   return res.status(200).json({ data: _notif });
// };
exports.getUnReadnotifications = async (req, res, next) => {
  let _notif;

  try {
    _notif = await ExchangeNotification.findAll({
      where: {
        exchangeId: req.userId,
        status: "unread",
      },
    });

    io.getio().emit("EXXXX", {
      data: _notif?.length,
    });
  } catch (error) {
    return next(new HttpError("An error occured, try again later", 500));
  }

  return res.status(200).json({ data: _notif?.length });
};
exports.getNotification = async (req, res, next) => {
  let _notif;
  const { page, pageSize } = req.body;

  offset = (page - 1) * pageSize;
  limit = pageSize;

  const twoMonthsAgo = new Date();
  twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);
  try {
    _notif = await ExchangeNotification.findAndCountAll({
      limit,
      offset,
      where: {
        exchangeId: req.userId,
        createdAt: {
          [Op.gte]: twoMonthsAgo,
        },
      },
      include: [{ model: Exchange }],
      order: [["createdAt", "DESC"]],
    });
  } catch (error) {
    return next(new HttpError("An error occured, try again later", 500));
  }

  return res.status(200).json({ data: _notif });
};
exports.downloadReceipts = async (req, res, next) => {
  let notification;
  let _foundReceipt;

  const _receiptId = req.params.receiptId;
  const _changedBy = req.params.changedBy;

  if (!_receiptId || !_changedBy) {
    return res.status(400).send("Request parameters is missing or empty");
  }

  if (_receiptId) {
    _foundReceipt = await Receipt.findByPk(_receiptId);
    _changedBy === "user"
      ? (_foundReceipt.status = true)
      : (_foundReceipt.status = false);
    await _foundReceipt.save();
  }

  if (_changedBy === "user") {
    try {
      notification = await FinancialNotification.create({
        title: "download receipt",
        message: "receipt was downloaded",
        ExchangeId: _foundReceipt?.ExchangeId,
      });
    } catch (error) {
      console.log("err", error);
    }

    let _notif = await FinancialNotification.findAll({
      where: { status: "unread" },
      include: [{ model: Exchange }],
      order: [["createdAt", "DESC"]],
    });

    io.getio().emit("downloadReceipt", {
      data: _notif,
    });
  }

  let filePath = path.join(
    __dirname,
    "..",
    "uploadedFiles",
    _foundReceipt?.company,
    "receipts",
    _foundReceipt?.file?.split(/[\/\\]/).pop()
  );

  const extractFileName = async (fullName) => {
    const lastHyphenIndex = fullName.lastIndexOf("-"); // Find the last hyphen (if any)

    if (lastHyphenIndex === -1) {
      return fullName; // No hyphen found, return the whole file name
    }

    const baseName = fullName.slice(0, lastHyphenIndex); // Extract the name before the hyphen
    const extension = fullName.split(".").pop(); // Get the file extension (after the dot)

    return `${baseName}.${extension}`; // Combine base name with extension
  };

  const fileName = await extractFileName(
    _foundReceipt?.file?.split(/[\/\\]/).pop()
  );

  res.setHeader("Content-Disposition", `attachment; filename=${fileName}`);
  res.download(filePath, fileName, (err) => {
    if (err) {
      console.log(err);
      res.status(404).send("File not found");
    }
  });
};
exports.latestDowloadedFiles = async (req, res, next) => {
  let _foundRelatedFile, result;

  const _exchangeId = req.userId;

  if (!_exchangeId) {
    return res.status(400).send("Request parameters is missing or empty");
  }

  try {
    _foundRelatedFile = await ExchangeFile.findAll({
      where: { ExchangeId: _exchangeId },
      include: [{ model: Exchange }, { model: FileType }],
      attributes: [
        "FileTypeId",
        "ExchangeId",
        "id",
        "description",
        "createdAt",
      ],
      order: [["createdAt", "DESC"]],
    });

    const groupedByFilesArray = Object.values(
      _foundRelatedFile?.reduce((acc, file) => {
        if (!acc[file.FileTypeId]) {
          acc[file.FileTypeId] = [];
        }
        acc[file.FileTypeId].push(file);
        return acc;
      }, {})
    );

    result = Object.values(groupedByFilesArray).slice(0, 3);
  } catch (error) {
    return next(new HttpError("An error occured, try again later", 500));
  }

  // if (!result || result.length === 0) {
  //   return next(new HttpError("not found", 404));
  // }

  return res.status(200).json({ data: result });
};

exports.getExchange = async (req, res, next) => {
  const _exchangeId = req.userId;

  if (!_exchangeId) {
    return res.status(400).send("Request parameters is missing or empty");
  }

  let _foundExchange;

  try {
    _foundExchange = await Exchange.findOne({
      where: {
        id: _exchangeId,
      },
      include: [{ model: ExchangeLoginHistory }],

      order: [[{ model: ExchangeLoginHistory }, "createdAt", "DESC"]],
    });
  } catch (error) {
    console.log(error);
    return next(new HttpError("An error occured, try again later", 500));
  }

  return res.status(200).json({ _foundExchange });
};
exports.downloadFile = async (req, res, next) => {
  try {
    const _fileId = req.params.fileId;

    if (!_fileId) {
      return res.status(400).send("Request body is missing or empty");
    }

    let _foundExchangeFile;

    try {
      _foundExchangeFile = await ExchangeFile.findByPk(_fileId, {
        include: [{ model: Exchange }],
      });
    } catch (error) {
      return res.status(500).json({ message: error });
    }

    let filePath = path.join(
      __dirname,
      "..",
      "uploadedFiles",
      _foundExchangeFile?.Exchange?.name,
      "files",
      _foundExchangeFile?.file?.split(/[\/\\]/).pop()
    );

    const extractFileName = async (fullName) => {
      const lastHyphenIndex = fullName?.lastIndexOf("-"); // Find the last hyphen (if any)

      if (lastHyphenIndex === -1) {
        return fullName; // No hyphen found, return the whole file name
      }

      const baseName = fullName.slice(0, lastHyphenIndex); // Extract the name before the hyphen
      const extension = fullName.split(".").pop(); // Get the file extension (after the dot)

      return `${baseName}.${extension}`; // Combine base name with extension
    };

    const fileName = await extractFileName(
      _foundExchangeFile?.file?.split(/[\/\\]/).pop()
    );

    res.setHeader("Content-Disposition", `attachment; filename=${fileName}`);
    res.download(filePath, fileName, (err) => {
      if (err) {
        console.log(err);
        res.status(404).send("File not found");
      }
    });
  } catch (error) {
    return next(new HttpError("خطای سمت سرور ، لطفا مجددا تلاش کنید.", 500));
  }
};
exports.getPublicFiles = async (req, res, next) => {
  const { page, pageSize } = req.body;
  const exchangeId = req.userId;
  // offset = (page - 1) * pageSize;
  limit = pageSize;
  let _publicFiles;
  try {
    _publicFiles = await ExchangeFile.findAll({
      where: {
        ExchangeId: exchangeId,
        fileType: "عمومی",
      },
      include: [{ model: FileType }],
    });
  } catch (error) {
    console.log("err", error);
    return next(new HttpError("خطای سمت سرور ، لطفا مجددا تلاش کنید.", 500));
  }

  const groupedByFilesArray = Object.values(
    _publicFiles?.reduce((acc, file) => {
      if (!acc[file.FileTypeId]) {
        acc[file.FileTypeId] = [];
      }
      acc[file.FileTypeId].push(file);
      return acc;
    }, {})
  );

  // Pagination logic
  const totalItems = groupedByFilesArray.length;
  // const totalPages = Math.ceil(totalItems / limit);
  const currentPage = parseInt(page);
  const startIndex = (currentPage - 1) * limit;
  const endIndex = startIndex + limit;

  const paginatedData = groupedByFilesArray.slice(startIndex, endIndex);

  // return res.status(200).json({ data: groupedByFilesArray });

  return res.status(200).json({
    data: paginatedData,
    pagination: {
      totalItems,
      // currentPage,
      // totalPages,
      // limit: parseInt(limit),
    },
  });
};

exports.getPrivateFiles = async (req, res, next) => {
  const exchangeId = req.userId;

  const { page, pageSize } = req.body;

  // offset = (page - 1) * pageSize;
  limit = pageSize;

  let _privateFiles;
  try {
    _privateFiles = await ExchangeFile.findAll({
      where: {
        ExchangeId: exchangeId,
        fileType: "خصوصی",
      },
      include: [{ model: FileType }],
    });
  } catch (error) {
    console.log("err", error);
    return next(new HttpError("خطای سمت سرور ، لطفا مجددا تلاش کنید.", 500));
  }

  // Group files by FileTypeId
  const groupedByFilesArray = Object.values(
    _privateFiles?.reduce((acc, file) => {
      if (!acc[file.FileTypeId]) {
        acc[file.FileTypeId] = [];
      }
      acc[file.FileTypeId].push(file);
      return acc;
    }, {})
  );

  // Pagination logic
  const totalItems = groupedByFilesArray.length;
  // const totalPages = Math.ceil(totalItems / limit);
  const currentPage = parseInt(page);
  const startIndex = (currentPage - 1) * limit;
  const endIndex = startIndex + limit;

  const paginatedData = groupedByFilesArray.slice(startIndex, endIndex);

  return res.status(200).json({
    data: paginatedData,
    pagination: {
      totalItems,
      // currentPage,
      // totalPages,
      // limit: parseInt(limit),
    },
  });
};

exports.regenerateCredentials = async (req, res, next) => {
  const { mobile } = req.body;

  let _hashedPassword;

  if (!mobile) {
    return res.status(400).send("Request body is missing or empty");
  }

  let _foundExchange = await Exchange.findOne({
    where: {
      mobile: mobile,
    },
  });

  if (!_foundExchange) {
    return next(new HttpError("Exchange not found", 404));
  }

  const _now = moment(new Date());
  const _ticketExpireDate = moment(_foundExchange.ticketExpireDate);

  if (_ticketExpireDate.diff(_now, "second") < 0) {
    const _randomPassword = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    try {
      _hashedPassword = await bcrypt.hash(_randomPassword, 12);
    } catch (err) {
      return next(new HttpError("An error occured, please try again.", 500));
    }

    // let today = new Date();
    // let twoMins = new Date(today.getTime() + 2 * 60 * 1000);

    const twoMins = moment().add(2, "minutes").toDate();
    console.log("tttttttttt", twoMins);

    try {
      _foundExchange.password = _hashedPassword;
      _foundExchange.ticketExpireDate = twoMins;

      await _foundExchange.save();
    } catch (error) {
      console.log("error", error);

      return next(new HttpError("An error occured, try again later", 500));
    }

    let sms;

    try {
      // sms = await axios.get(
      //   `https://login.niazpardaz.ir/SMSInOutBox/SendSms?username=d.momeni&password=rag%23818&from=10009611&to=${mobile}&text= موبایل: ${mobile} %0A رمز عبور: ${_randomPassword}`
      // );
    } catch (error) {
      return next(new HttpError("An error occured, try again later", 500));
    }
    return res.status(200).json({
      mobile: mobile,
      password: _randomPassword,
    });
  } else {
    return res.status(201).send(); //The previous randomPassword is still valid
  }
};

exports.generateCredentials = async (req, res, next) => {
  const { mobile } = req.body;

  if (!mobile) {
    return res.status(400).send("Request body is missing or empty");
  }
  let _hashedPassword;
  let _foundExchange;

  try {
    _foundExchange = await Exchange.findOne({
      where: {
        mobile: mobile,
      },
    });
  } catch (error) {
    return next(new HttpError("An error occured, please try again.", 500));
  }

  if (!_foundExchange) {
    return next(new HttpError("Exchange not found", 404));
  }

  if (!_foundExchange?.authenticatedByAdmin) {
    return res.status(403).json({
      msg: "You are not allowed to log in",
    });
  }

  const _randomPassword = Math.floor(
    100000 + Math.random() * 900000
  ).toString();

  try {
    _hashedPassword = await bcrypt.hash(_randomPassword, 12);
  } catch (err) {
    console.log("err", err);

    return next(new HttpError("An error occured, please try again.", 500));
  }

  let today = new Date();
  let tenMins = new Date(today.getTime() + 10 * 60 * 1000);
  let twoMins = new Date(today.getTime() + 2 * 60 * 1000); //After 3 failed attempts, the user can log in after 10 minutes

  const _now = moment(new Date());
  const _securityCodeExpireDate = moment(
    _foundExchange?.securityCodeExpireDate
  );
  const _ticketExpireDate = moment(_foundExchange?.ticketExpireDate);

  try {
    _foundExchange.password = _hashedPassword;

    _foundExchange.ticketExpireDate =
      _ticketExpireDate.diff(_now, "second") > 0 &&
      _foundExchange.securityCodeCounter > 3
        ? _foundExchange.ticketExpireDate
        : twoMins;
    _foundExchange.securityCodeExpireDate =
      _securityCodeExpireDate.diff(_now, "second") < 0 &&
      _foundExchange.securityCodeCounter > 3
        ? _foundExchange.securityCodeExpireDate
        : tenMins;

    await _foundExchange.save();
  } catch (error) {
    console.log("eeee", error);

    return next(new HttpError("An error occured, try again later", 500));
  }

  let sms;

  try {
    // sms = await axios.get(
    //   `https://login.niazpardaz.ir/SMSInOutBox/SendSms?username=d.momeni&password=rag%23818&from=10009611&to=${mobile}&text= موبایل: ${mobile} %0A رمز عبور: ${_randomPassword}`
    // );
  } catch (error) {
    return next(new HttpError("An error occured, try again later", 500));
  }
  return res.status(200).json({
    mobile: mobile,
    password: _randomPassword,
    authenticatedByAdmin: _foundExchange.authenticatedByAdmin,
  });
};

exports.checkPassword = async (req, res, next) => {
  const { mobile, sms } = req.body;

  if (!mobile || !sms) {
    return res.status(400).send("Request body is missing or empty");
  }

  let _foundExchange = await Exchange.findOne({
    where: {
      mobile: mobile,
    },
  });

  if (!_foundExchange) {
    return next(new HttpError("Exchange not found", 404));
  }

  const _now = moment(new Date());
  const _ticketExpireDate = moment(_foundExchange?.ticketExpireDate);
  const _securityCodeExpireDate = moment(
    _foundExchange?.securityCodeExpireDate
  );

  let _unhashedPassword;
  try {
    _unhashedPassword = await bcrypt.compare(sms, _foundExchange.password);
  } catch (err) {
    return next(new HttpError("An error occured, please try again", 500));
  }

  if (
    _foundExchange.securityCodeCounter >= 3 &&
    _securityCodeExpireDate.diff(_now, "second") < 0
  ) {
    _foundExchange.securityCodeCounter = 0;
    await _foundExchange.save();
  }

  if (_foundExchange.securityCodeCounter > 3) {
    return res.status(403).json({
      msg: "Your account has been suspended for a while... Try later",
    });
  }

  if (
    _securityCodeExpireDate.diff(_now, "second") > 0 &&
    _foundExchange.securityCodeCounter <= 3
  ) {
    _foundExchange.securityCodeCounter = _foundExchange.securityCodeCounter + 1;
    await _foundExchange.save();
  }

  if (_ticketExpireDate.diff(_now, "second") < 0) {
    return res.status(410).json({
      msg: " کد امنیتی منقضی شده است",
    });
  }
  if (!_unhashedPassword) {
    return res.status(424).json({
      msg: " کد(های) امنیتی اشتباه است",
    });
  }

  try {
    token = jwt.sign(
      {
        clientId: _foundExchange.id,
        mobile: mobile,
      },
      "mySecretKey :) ",
      {
        expiresIn: "10h",
      }
    );
  } catch (err) {
    return next(new HttpError("An error occured, try again later", 500));
  }

  const _ip =
    req.headers["x-forwarded-for"] || req.socket.remoteAddress || req.ip;

  const parser = new UAParser();
  const ua = req.get("User-Agent");
  const browserInfo = parser.setUA(ua).getBrowser();
  const osInfo = parser.setUA(ua).getOS();
  let _device = browserInfo.name + " " + " On " + osInfo.name;

  if (
    _unhashedPassword &&
    _ticketExpireDate.diff(_now, "second") > 0 &&
    _securityCodeExpireDate.diff(_now, "second") > 0
  ) {
    _foundExchange.securityCodeCounter = 0;
    await _foundExchange.save();
  }

  try {
    await ExchangeLoginHistory.create({
      ExchangeId: _foundExchange?.id,
      login: new Date(),
      ip: _ip,
      device: _device,
    });
  } catch (error) {
    return next(new HttpError("An error occured, please try again", 500));
  }
  return res.status(200).json({
    token,
    exchangeId: _foundExchange?.id,
  });
};

exports.register = async (req, res, next) => {
  const _session = await sequelize.transaction();
  const { mobile, username } = req.body;

  if (!mobile || !username) {
    await _session.rollback();
    return next(new HttpError("Mobile and username are required", 400));
  }

  let _newExchange;

  try {
    _newExchange = await Exchange.create(
      {
        mobile,
        username,
        name: username,
      },
      { transaction: _session }
    );
  } catch (error) {
    await _session.rollback();

    console.error("Exchange creation error:", error);

    if (error?.errors?.[0]?.message === "mobile must be unique") {
      return next(new HttpError("Mobile number already exists", 403));
    }

    return next(new HttpError("Failed to create exchange", 500));
  }

  try {
    const _notif = await NewUserNotification.create(
      {
        title: "New User",
        message: "A new user has been created",
        ExchangeId: _newExchange.id,
      },
      { transaction: _session }
    );

    io.getio().emit("exchangeRegisteration", {
      data: _notif,
    });
  } catch (error) {
    await _session.rollback();
    console.error("Notification creation error:", error);
    return next(new HttpError("Failed to create notification", 500));
  }

  let _notif;
  try {
    _notif = await NewUserNotification.findAll({
      where: { status: "unread" },
      include: [{ model: Exchange }],
      order: [["createdAt", "DESC"]],
    });

    io.getio().emit("exchangeRegistration", {
      data: _notif,
    });
  } catch (error) {
    await _session.rollback();
    console.error("Notification fetch or socket emit error:", error);
    return next(new HttpError("Failed to fetch notifications", 500));
  }

  try {
    await _session.commit();
    return res.status(201).json({ msg: "Exchange was created successfully" });
  } catch (error) {
    await _session.rollback();
    console.error("Transaction commit error:", error);
    return next(new HttpError("Failed to finalize exchange creation", 500));
  }
};

exports.latestExchangeNotification = async (req, res, next) => {
  const exchangeId = req.userId;
  let _notif;

  console.log("rrrrrrrrrrrrrrrrrrrrr", req.userId);

  try {
    _notif = await ExchangeNotification.findAll({
      where: {
        ExchangeId: exchangeId,
      },
      limit: 6,
      include: [{ model: Exchange }],
      order: [["createdAt", "DESC"]],
    });
  } catch (error) {
    return res.status(500).json({ data: error });
  }

  return res.status(200).json({ data: _notif });
};
// exports.exchangeNotification = async (req, res, next) => {
//   const exchangeId = req.userId;

//   let _notif;

//   const twoMonthsAgo = new Date();
//   twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);

//   try {
//     _notif = await ExchangeNotification.findAll({
//       where: {
//         ExchangeId: exchangeId,
//         createdAt: {
//           [Op.gte]: twoMonthsAgo,
//         },
//       },

//       include: [{ model: Exchange }],
//       order: [["createdAt", "DESC"]],
//     });
//   } catch (error) {
//     return res.status(500).json({ data: error });
//   }

//   return res.status(200).json({ data: _notif });
// };

exports.updateExchange = async (req, res, next) => {
  const { mobile } = req.body;
  const exchangeId = req.userId;

  const file = req?.files;

  if (!mobile) {
    return res
      .status(400)
      .json({ message: "Request body is missing or incomplete" });
  }

  try {
    const exchange = await Exchange.findByPk(exchangeId);
    if (!exchange) {
      return next(new HttpError("No exchange found", 404));
    }

    const notifications = [];

    if (file[0]?.path) {
      notifications.push({
        title: "update profile photo",
        message: "Profile photo was updated",
        ExchangeId: exchange.id,
      });
    }

    if (exchange.mobile !== mobile) {
      notifications.push({
        title: "update mobile",
        message: "Mobile was updated",
        ExchangeId: exchange.id,
      });
    }

    if (exchange.image) {
      const oldImagePath = path.join(
        __dirname,
        "..",
        "uploadedFiles",
        exchange.name,
        "profile",
        path.basename(exchange.image)
      );

      try {
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
          console.log("Old image deleted successfully");
        }
      } catch (err) {
        console.error("Error deleting old image:", err);
      }
    }

    exchange.mobile = mobile;
    exchange.image = file && file[0]?.path;

    await exchange.save();

    await ProfileNotification.bulkCreate(notifications);

    const mobileNotifications = await ProfileNotification.findAll({
      where: { status: "unread", title: "update mobile" },
      include: [{ model: Exchange }],
      order: [["createdAt", "DESC"]],
    });

    io.getio().emit("changeMobile", { data: mobileNotifications });

    const profilePhotoNotifications = await ProfileNotification.findAll({
      where: { status: "unread", title: "update profile photo" },
      include: [{ model: Exchange }],
      order: [["createdAt", "DESC"]],
    });

    io.getio().emit("changeProfile", { data: profilePhotoNotifications });

    return res.status(200).json({ data: exchange });
  } catch (error) {
    console.error("Error updating exchange:", error);
    const statusCode =
      error?.name === "SequelizeUniqueConstraintError" ? 403 : 500;
    return next(
      new HttpError(
        "An error occurred while updating exchange, try again later",
        statusCode
      )
    );
  }
};

exports.getExchangeWithPagination = async (req, res, next) => {
  const { page, pageSize } = req.body;

  offset = (page - 1) * pageSize;
  limit = pageSize;

  const _exchangeId = req.userId;

  let _foundExchange, _foundExchangeHistory;

  _foundExchange = await Exchange.findByPk(_exchangeId);

  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  try {
    _foundExchangeHistory = await ExchangeLoginHistory.findAndCountAll({
      limit,
      offset,
      where: {
        ExchangeId: _exchangeId,
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
    .json({ exchange: _foundExchange, loginHistory: _foundExchangeHistory });
};
exports.latestReceipts = async (req, res, next) => {
  const exchangeId = req.userId;

  let _foundReceipts;

  try {
    _foundReceipts = await Receipt.findAll({
      limit: 3,
      // attributes: ["id", "title", "price", "createdAt", "status"],
      where: {
        ExchangeId: exchangeId,
      },

      order: [["createdAt", "DESC"]],
    });
  } catch (error) {
    console.log(error);
    return next(new HttpError("An error occured, try again later", 500));
  }

  if (_foundReceipts?.length === 0) {
    return next(new HttpError("not found", 404));
  }

  return res.status(200).json({ data: _foundReceipts });
};
exports.getReceipts = async (req, res, next) => {
  const { page, pageSize } = req.body;
  const exchangeId = req.userId;
  let _foundReceipts, offset, limit;

  offset = (page - 1) * pageSize;
  limit = pageSize;

  try {
    _foundReceipts = await Receipt.findAndCountAll({
      limit,
      offset,
      // attributes: ["id", "title", "price", "createdAt", "status", "file" ,"company"],
      where: {
        ExchangeId: exchangeId,
      },

      order: [["createdAt", "DESC"]],
    });
  } catch (error) {
    console.log(error);
    return next(new HttpError("An error occured, try again later", 500));
  }

  if (_foundReceipts?.count === 0) {
    return next(new HttpError("not found", 404));
  }

  return res.status(200).json({ data: _foundReceipts });
};

exports.searchFactors = async (req, res, next) => {
  const { item } = req.body;

  const queryOptions = {
    where: {
      ClientId: req.userId,
    },
    include: [
      { model: ClientAddress },
      {
        model: Client,
        attributes: ["name", "mobile"],
      },
      {
        model: TimeSlot,
        attributes: ["startTime"],
      },
      {
        model: StatusFactor,
        attributes: ["id", "status", "color", "bgColor"],
      },
      {
        model: FactorDetails,
        // include: [
        //   {
        //     model: Product,
        //     attributes: ["mainTitle", "mainImage", "price", "discount"],
        //   },
        // ],
      },
    ],
    order: [["createdAt", "DESC"]],
  };

  try {
    if (item) {
      queryOptions.where = {
        ...queryOptions.where,
        [Op.or]: [{ price: item }, { trackingCode: item }],
      };
    }

    const _allFactors = await Factor.findAll(queryOptions);

    if (!_allFactors.length) {
      return next(new HttpError("رکوردی یافت نشد .", 404));
    }

    return res.status(200).json({ data: _allFactors });
  } catch (error) {
    console.error("searchFactors error:", error);
    return next(new HttpError("An error occurred, try again later", 500));
  }
};

exports.searchFiles = async (req, res, next) => {
  const { item, type } = req.body;

  try {
    const _files = await ExchangeFile.findAll({
      where: {
        ExchangeId: req.userId,
        fileType: type,
      },
      include: [
        { model: Exchange },
        {
          model: FileType,
          where: {
            type: {
              [Op.like]: `%${item}%`,
            },
          },
        },
      ],
      order: [["createdAt", "DESC"]], // Sorting by createdAt in descending order
    });

    if (!_files || _files?.length === 0) {
      return next(new HttpError("not found", 404));
    }

    const result = _files.map((obj) => [obj]);
    return res.status(200).json({ data: result });
  } catch (error) {
    console.log(error);

    return next(new HttpError("An error occured, try again later", 500));
  }
};

exports.searchReceipt = async (req, res, next) => {
  const { title, price, dateFrom, dateTo, page, pageSize } = req.body;

  const exchangeId = req.userId;

  const offset = (page - 1) * pageSize;
  const limit = pageSize;

  try {
    const conditions = {
      ExchangeId: exchangeId,
    };

    const filters = [];
    if (title) {
      filters.push({ title: { [Op.like]: `%${title}%` } });
    }
    if (price) {
      const formattedPrice = price.replace(/,/g, "");
      filters.push({ price: formattedPrice });
    }
    if (dateFrom || dateTo) {
      filters.push({
        createdAt: {
          ...(dateFrom && { [Op.gte]: dateFrom }),
          ...(dateTo && { [Op.lte]: dateTo }),
        },
      });
    }

    if (filters.length > 0) {
      conditions[Op.or] = filters;
    }

    const _receipts = await Receipt.findAndCountAll({
      where: conditions,
      limit,
      offset,
      order: [["createdAt", "DESC"]],
    });

    if (_receipts.count === 0) {
      return next(new HttpError("Not found", 404));
    }

    return res.status(200).json({ data: _receipts });
  } catch (error) {
    return next(new HttpError("An error occurred, try again later", 500));
  }
};
