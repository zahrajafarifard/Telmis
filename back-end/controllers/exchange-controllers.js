const fs = require("fs");
const path = require("path");
const axios = require("axios");

const { Op } = require("sequelize");
const sharp = require("sharp");
const ExchangeFiles = require("../models/exchange-files");
const Exchange = require("../models/exchange");

const Receipt = require("../models/receipt");
const HttpError = require("../models/http-error");
const ExchangeLoginHistory = require("../models/login-history");

const NewUserNotification = require("../models/new-user-notification");
const ProfileNotification = require("../models/profile-notification");
const FinancialNotification = require("../models/financial-notification");
const ExchangeNotification = require("../models/exchange-notification");
const FileType = require("../models/fileType");

const io = require("../socket");

exports.financialNotification = async (req, res, next) => {
  let _notif;
  const { page, pageSize } = req.body;

  let offset, limit;
  offset = (page - 1) * pageSize;
  limit = pageSize;

  const twoMonthsAgo = new Date();
  twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);

  try {
    _notif = await FinancialNotification.findAndCountAll({
      where: {
        createdAt: {
          [Op.gte]: twoMonthsAgo,
        },
      },
      limit,
      offset,
      include: [{ model: Exchange }],
      order: [["createdAt", "DESC"]],
    });
  } catch (error) {
    return next(new HttpError("An error occured, try again later", 500));
  }

  return res.status(200).json({ data: _notif });
};
exports.profileNotification = async (req, res, next) => {
  let _notif;
  const { page, pageSize } = req.body;

  const twoMonthsAgo = new Date();
  twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);

  let offset, limit;
  offset = (page - 1) * pageSize;
  limit = pageSize;
  try {
    _notif = await ProfileNotification.findAndCountAll({
      where: {
        createdAt: {
          [Op.gte]: twoMonthsAgo,
        },
      },
      limit,
      offset,
      include: [{ model: Exchange }],
      order: [["createdAt", "DESC"]],
    });
  } catch (error) {
    return next(new HttpError("An error occured, try again later", 500));
  }

  return res.status(200).json({ data: _notif });
};
exports.notification = async (req, res, next) => {
  let _notif;
  const { page, pageSize } = req.body;

  const twoMonthsAgo = new Date();
  twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);

  let offset, limit;
  offset = (page - 1) * pageSize;
  limit = pageSize;

  try {
    _notif = await NewUserNotification.findAndCountAll({
      where: {
        createdAt: {
          [Op.gte]: twoMonthsAgo,
        },
      },
      limit,
      offset,
      include: [{ model: Exchange }],
      order: [["createdAt", "DESC"]],
    });
  } catch (error) {
    return next(new HttpError("An error occured, try again later", 500));
  }

  return res.status(200).json({ data: _notif });
};
exports.getRequests = async (req, res, next) => {
  let _requests;

  _requests = await Exchange.findAll({
    where: {
      authenticatedByAdmin: 0,
    },
  });

  return res.status(200).json({ data: _requests });
};
exports.create = async (req, res, next) => {
  const { mobile, username } = req.body;

  if (!mobile || !username) {
    return res.status(400).send("Request body is missing or empty");
  }

  const file = req?.files[0];

  try {
    await Exchange.create({
      mobile,
      username,
      name: username,
      image: file?.path,
      authenticatedByAdmin: 1,
    });
  } catch (error) {
    if (error?.name === "SequelizeUniqueConstraintError") {
      return next(new HttpError("invalid name", 409));
    } else {
      return next(new HttpError("An error occured, try again later", 500));
    }
  }

  return res.status(201).json({ message: "Exchange was successfully created" });
};
exports.confirmRequest = async (req, res, next) => {
  const { id, username, mobile } = req.body;
  let _foundExchange;
  _foundExchange = await Exchange.findByPk(id);

  if (!_foundExchange) {
    return next(new HttpError("Exchange not found", 404));
  }

  try {
    _foundExchange.authenticatedByAdmin = 1;
    _foundExchange.username = username;
    _foundExchange.mobile = mobile;
    await _foundExchange.save();
  } catch (error) {
    return next(new HttpError("An error occured , please try again", 500));
  }

  return res.status(201).json({ msg: "The exchange was updated successfully" });
};
exports.refuseRequest = async (req, res, next) => {
  const { id } = req.body;
  let _foundExchange, _foundNotification;
  _foundExchange = await Exchange.findByPk(id);

  if (!_foundExchange) {
    return next(new HttpError("Exchange not found", 404));
  }

  _foundNotification = await NewUserNotification.findOne({
    where: { ExchangeId: id },
  });

  try {
    await _foundExchange.destroy();
    _foundNotification && (await _foundNotification.destroy());
  } catch (error) {
    return next(new HttpError("An error occured , please try again", 500));
  }

  return res.status(200).json({ msg: "The exchange was updated successfully" });
};
exports.confirmRequests = async (req, res, next) => {
  const { requests } = req.body;

  let _foundExchange;

  for (const request of requests) {
    _foundExchange = await Exchange.findByPk(request.id);

    if (!_foundExchange) {
      return next(new HttpError("Exchange not found", 404));
    }

    try {
      _foundExchange.authenticatedByAdmin = 1;
      _foundExchange.username = request.username;
      _foundExchange.mobile = request.mobile;
      await _foundExchange.save();
    } catch (error) {
      return next(new HttpError("An error occured , please try again", 500));
    }
  }

  return res.status(201).json({ msg: "The exchange was updated successfully" });
};
exports.refuseRequests = async (req, res, next) => {
  const { requests } = req.body;

  let _foundExchange, _foundNotification;

  for (const request of requests) {
    _foundExchange = await Exchange.findByPk(request.id);

    if (!_foundExchange) {
      return next(new HttpError("Exchange not found", 404));
    }

    _foundNotification = await NewUserNotification.findOne({
      where: { ExchangeId: request.id },
    });

    try {
      await _foundExchange.destroy();
      _foundNotification && (await _foundNotification.destroy());
    } catch (error) {
      return next(new HttpError("An error occured , please try again", 500));
    }
  }
  return res.status(200).json({ msg: "The exchange was updated successfully" });
};

exports.getExchange = async (req, res, next) => {
  const _exchangeId = req.params.exchangeId;

  let _foundExchange;

  const { page, pageSize } = req.body;

  let offset, limit;
  offset = (page - 1) * pageSize;
  limit = pageSize;

  try {
    _foundExchange = await Exchange.findOne({
      where: {
        id: _exchangeId,
      },
    });

    const _foundExchangeHistory = await ExchangeLoginHistory.findAndCountAll({
      limit,
      offset,
      where: {
        ExchangeId: _exchangeId,
      },

      order: [["createdAt", "DESC"]],
    });

    return res
      .status(200)
      .json({ data: _foundExchange, history: _foundExchangeHistory });
  } catch (error) {
    console.log(error);
    return next(new HttpError("An error occured, try again later", 500));
  }
};
exports.adminUpdateExchange = async (req, res, next) => {
  const { exchangeId, username, mobile } = req.body;

  let _foundExchange;

  try {
    _foundExchange = await Exchange.findByPk(exchangeId);
  } catch (error) {
    return next(new HttpError("An error occured, try again later", 500));
  }

  if (!_foundExchange) {
    return next(new HttpError("No exchange found", 404));
  }

  let _txt = "";

  if (_foundExchange?.username !== username) {
    _txt = "username  changed";
  }
  if (_foundExchange?.mobile !== mobile) {
    _txt = "mobile changed";
  }

  try {
    _foundExchange.username = username;
    _foundExchange.mobile = mobile;

    await _foundExchange.save();

    const notification = await ExchangeNotification.create({
      action: _txt,
      actionId: _foundExchange.id,
      message: "user info changed",
      ExchangeId: exchangeId,
    });

    const _notif = await ExchangeNotification.findAll({
      where: {
        status: "unread",
        // title: _txt,
        ExchangeId: exchangeId,
      },
      include: [{ model: Exchange }],
      order: [["createdAt", "DESC"]],
    });

    io.getio().emit("userInfoClient", {
      data: _notif,
    });
  } catch (error) {
    return next(
      new HttpError(
        "An error occured while updating exchange, try again later",
        500
      )
    );
  }

  try {
    // sms = await axios.get(
    //   `https://login.niazpardaz.ir/SMSInOutBox/SendSms?username=d.momeni&password=rag%23818&from=10009611&to=${_foundExchange?.mobile}&text= موبایل: ${mobile} %0A  نام کاربری: ${_foundExchange?.username}`
    // );
  } catch (error) {
    console.log("error:", error);
    return next(new HttpError("An error occured, try again later", 500));
  }

  return res
    .status(200)
    .json({ message: "The exchange was successfully updated" });
};

exports.uploadImage = async (req, res, next) => {
  let _exchange;

  const { exchangeId, changedBy } = req.body;
  const file = req?.files[0];

  try {
    _exchange = await Exchange.findByPk(exchangeId);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "An error occured, try again later" });
  }

  if (!_exchange) {
    return next(new HttpError("No records found", 404));
  }

  if (_exchange?.image) {
    let filePath = path.join(
      __dirname,
      "..",
      "uploadedFiles",
      _exchange?.name,
      "profile",
      _exchange?.image?.split(/[\/\\]/).pop()
    );

    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log("File deleted successfully");
      } else {
        console.error("File does not exist");
      }
    } catch (err) {
      console.error(err);
    }
  }

  _exchange.image = file?.path;
  await _exchange.save();

  if (changedBy === "admin") {
    const notificationClient = await ExchangeNotification.create({
      action: "update profile photo",
      actionId: _exchange?.id,
      message: "profile photo was updated",
      ExchangeId: _exchange?.id,
    });

    const _notifClient = await ExchangeNotification.findAll({
      where: {
        status: "unread",
        // title: "update profile photo",
        ExchangeId: _exchange?.id,
      },
      include: [{ model: Exchange }],
      order: [["createdAt", "DESC"]],
    });

    io.getio().emit("changeProfileClient", {
      data: _notifClient,
    });
  }

  if (changedBy === "user") {
    const notification = await ProfileNotification.create({
      title: "update profile photo",
      message: "profile photo was updated",
      ExchangeId: _exchange?.id,
    });

    const _notif = await ProfileNotification.findAll({
      where: {
        status: "unread",
        title: "update profile photo",
      },
      include: [{ model: Exchange }],
      order: [["createdAt", "DESC"]],
    });

    io.getio().emit("changeProfile", {
      data: _notif,
    });
  }

  return res.status(200).json({ data: _exchange });
};
exports.getExchanges = async (req, res, next) => {
  let _exchanges;

  try {
    _exchanges = await Exchange.findAll({
      where: {
        authenticatedByAdmin: 1,
      },
    });
  } catch (error) {
    return next(new HttpError("An error occured, try again later", 500));
  }

  if (_exchanges.length === 0) {
    // return next(new HttpError("There's no record", 404));
  }

  return res.status(200).json({ exchanges: _exchanges });
};
exports.getFile = async (req, res, next) => {
  const _id = req.params.id;

  let _download;

  try {
    _download = await ExchangeFiles.findByPk(_id, {
      include: [{ model: Exchange }, { model: FileType }],
    });
  } catch (error) {
    return next(new HttpError("An error occured, try again later", 500));
  }

  return res.status(200).json({ data: _download });
};

exports.getAllFiles = async (req, res, next) => {
  const { page, pageSize } = req.body;

  let _downloads;
  let offset, limit;
  offset = (page - 1) * pageSize;
  limit = pageSize;

  try {
    _downloads = await ExchangeFiles.findAndCountAll({
      limit,
      offset,

      include: [{ model: Exchange }],
      order: [["createdAt", "DESC"]],
    });
  } catch (error) {
    return next(new HttpError("An error occured, try again later", 500));
  }

  return res.status(200).json({ data: _downloads });
};
exports.searchFile = async (req, res, next) => {
  let _files;

  const {
    dateFrom,
    dateTo,
    version,
    title,
    fileType,
    exchangeId,
    page,
    pageSize,
  } = req.body;

  let offset = (page - 1) * pageSize;
  let limit = pageSize;

  let _allExchanges = [];

  if (exchangeId === undefined || !exchangeId || exchangeId.length === 0) {
    return res.status(400).json({ data: "invalid exchage id" });
  }

  if (
    !title &&
    !dateFrom &&
    !dateTo &&
    fileType == "نوع فایل را انتخاب کنید" &&
    !version
  ) {
    for (const element of exchangeId) {
      _files = await ExchangeFiles.findAndCountAll({
        limit,
        offset,
        where: {
          ExchangeId: element,
        },
        include: [{ model: Exchange }],
        distinct: true,
      });
      _allExchanges.push(_files);
    }

    _files = [..._allExchanges];

    return res.status(200).json({ data: _files[0] });
  }

  try {
    for (const element of exchangeId) {
      _files = await ExchangeFiles.findAndCountAll({
        limit,
        offset,
        where: {
          ExchangeId: element, // Required ExchangeId condition
          ...(title || fileType || version || dateFrom || dateTo
            ? {
                [Op.or]: [
                  title ? { title: { [Op.like]: `%${title}%` } } : null, // Add only if title is not null
                  fileType
                    ? { fileType: { [Op.like]: `%${fileType}%` } }
                    : null, // Add only if title is not null
                  version ? { version: { [Op.like]: `%${version}%` } } : null, // Add only if title is not null

                  dateFrom || dateTo
                    ? {
                        createdAt: {
                          ...(dateFrom ? { [Op.gte]: dateFrom } : {}),
                          ...(dateTo ? { [Op.lte]: dateTo } : {}),
                        },
                      }
                    : null, // Add only if dateFrom or dateTo is defined
                ].filter(Boolean), // Remove null conditions
              }
            : {}), // No additional conditions when all inputs are empty
        },
        distinct: true,
        include: [{ model: Exchange }],
      });

      _allExchanges.push(_files);
    }

    _files = _allExchanges.filter((item) => item.count !== 0);
  } catch (error) {
    return next(new HttpError("An error occurred, try again later", 500));
  }

  const result = _files.reduce(
    (acc, current) => {
      acc.count += current.count; // Sum up the counts
      acc.rows.push(...current.rows.flat()); // Flatten and merge the rows
      return acc;
    },
    { count: 0, rows: [] } // Initial accumulator
  );

  if (!_files || _files.length === 0) {
    return next(new HttpError("not found", 404));
  }

  return res.status(200).json({ data: result });
};

exports.uploadFiles = async (req, res, next) => {
  try {
    const {
      fileType,
      title,
      version,
      description,
      exchangeId,
      selectedFileType,
    } = req.body;

    let newFileRecord, _foundExchange;

    if (
      !fileType ||
      !title ||
      !version ||
      !description ||
      !exchangeId ||
      !selectedFileType
    ) {
      return res.status(400).send("Request body is missing or empty");
    }

    // Files from multer
    const files = req.files.files || []; // Handle case if no files are uploaded
    const images = req.files.images || []; // Handle case if no images are uploaded

    try {
      _foundExchange = await Exchange.findByPk(exchangeId);
    } catch (error) {
      return res.status(500).send("err 500");
    }

    const filePath = files[0]?.path || null;
    // const imagePath = images[0]?.path || null;

    try {
      const image = sharp(images[0]?.path);
      const metadata = await image?.metadata();

      let oheight = metadata?.height,
        owidth = metadata?.width,
        mheight = 200,
        mwidth = 400,
        theight,
        twidth;

      let oratio = owidth / oheight, // (~1.54)
        mratio = mwidth / mheight; // (2)

      if (mratio > oratio) {
        theight = mheight;
        twidth = theight * oratio;
      } else {
        twidth = mwidth;
        theight = twidth / oratio;
      }

      const resizedImagePath =
        "uploadedFiles/" +
        _foundExchange?.name +
        "/images/" +
        "resized-" +
        images[0]?.filename?.split(/[\/\\]/).pop();

      await sharp(images[0]?.path)
        .resize(Math.ceil(twidth), Math.ceil(theight))
        .toFile(resizedImagePath);

      newFileRecord = await ExchangeFiles.create({
        ExchangeId: exchangeId,
        fileType,
        title,
        version,
        FileTypeId: selectedFileType,
        description,
        image: `uploadedFiles/${_foundExchange?.name}/images/${resizedImagePath
          ?.split(/[\/\\]/)
          .pop()}`,
        file: `uploadedFiles/${_foundExchange?.name}/files/${filePath
          ?.split(/[\/\\]/)
          .pop()}`,
      });
    } catch (error) {
      return res.status(500).send("err 500");
    }

    let directoryPath = path.join(
      __dirname,
      "..",
      "uploadedFiles",
      _foundExchange?.name,
      "images"
    );

    fs.readdir(directoryPath, (err, files) => {
      if (err) {
        console.error("Unable to scan directory:", err);
        return;
      }

      files.forEach((file) => {
        if (!file.startsWith("resized")) {
          const filePath = path.join(directoryPath, file);
          fs.unlink(filePath, (err) => {
            if (err) {
              console.error(`Error deleting file ${filePath}:`, err);
            } else {
              console.log(`Successfully deleted file: ${filePath}`);
            }
          });
        }
      });
    });

    try {
      const notification = await ExchangeNotification.create({
        action: "add new file",
        actionId: newFileRecord?.id,
        message: "new file added",
        ExchangeId: exchangeId,
      });

      const _notif = await ExchangeNotification.findAll({
        where: {
          status: "unread",
          // title: "add new file",
          // ExchangeId: exchangeIdItem,
        },
        include: [{ model: Exchange }],
        order: [["createdAt", "DESC"]],
      });

      io.getio().emit("addFileClient", {
        data: _notif,
      });
    } catch (error) {
      return res.status(500).send("err 500");
    }

    res.status(200).json({
      message: "Files and data saved successfully!",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong during file upload" });
  }
};
exports.getReceipts = async (req, res, next) => {
  const { page, pageSize } = req.body;

  let _foundReceipts, offset, limit;

  const _exchangeId = req.params.exchangeId;

  offset = (page - 1) * pageSize;
  limit = pageSize;

  try {
    _foundReceipts = await Receipt.findAndCountAll({
      limit,
      offset,
      where: {
        ExchangeId: _exchangeId,
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

exports.searchReceipt = async (req, res, next) => {
  let _receipts;
  const { exchangeId, title, price, dateFrom, dateTo, page, pageSize } =
    req.body;

  offset = (page - 1) * pageSize;
  limit = pageSize;

  let _price = price?.replace(/,/g, "")?.toLocaleString();

  if (exchangeId === undefined || !exchangeId) {
    return res.status(400).json({ data: "invalid exchage id" });
  }

  try {
    _receipts = await Receipt.findAndCountAll({
      limit,
      offset,
      where: {
        ExchangeId: exchangeId, // Required ExchangeId condition
        // ...(title || _price !== undefined || dateFrom || dateTo
        //   ? {
        [Op.or]: [
          title ? { title: { [Op.like]: `%${title}%` } } : null, // Add only if title is not null
          _price !== undefined ? { price: _price } : null, // Add only if _price is not undefined
          dateFrom || dateTo
            ? {
                date: {
                  ...(dateFrom ? { [Op.gte]: dateFrom } : {}),
                  ...(dateTo ? { [Op.lte]: dateTo } : {}),
                },
              }
            : null, // Add only if dateFrom or dateTo is defined
        ].filter(Boolean), // Remove null conditions
        //   }
        // : {}), // No additional conditions when all inputs are empty
      },
      order: [["createdAt", "DESC"]],
    });
  } catch (error) {
    return next(new HttpError("An error occurred, try again later", 500));
  }

  if (_receipts?.count === 0) {
    return next(new HttpError("Not found", 404));
  }

  return res.status(200).json({ data: _receipts });
};

exports.searchFiles = async (req, res, next) => {
  let result;

  const { item } = req.body;

  try {
    // const { Op } = require("sequelize");

    const _files = await ExchangeFiles.findAll({
      attributes: [
        "FileTypeId",
        "ExchangeId",
        "id",
        "fileType",
        "file",
        "image",
        "title",
        "version",
        "description",
        "createdAt",
      ],
      where: {
        file: {
          [Op.regexp]: `.*${item}.*-[0-9]+\\.[a-zA-Z0-9]+$`,
        },
      },
      include: [{ model: Exchange }],
      order: [["createdAt", "DESC"]],
    });

    // Filter to mimic GROUP BY functionality
    const filteredFiles = _files.reduce((acc, file) => {
      const key = `${file.FileTypeId}-${file.ExchangeId}`;
      if (!acc[key]) {
        acc[key] = file; // Only the latest record is kept due to order by createdAt DESC
      }
      return acc;
    }, {});

    result = Object.values(filteredFiles);
  } catch (error) {
    return next(new HttpError("An error occured, try again later", 500));
  }

  // if (!_files || _files?.length === 0) {
  if (!result || result?.length === 0) {
    return next(new HttpError("not found", 404));
  }

  return res.status(200).json({ data: result });
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
exports.deleteReceipt = async (req, res, next) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).send("Request body is missing or empty");
  }

  let _foundReceipt, _relatedNotification;

  try {
    _foundReceipt = await Receipt.findByPk(id);
  } catch (error) {
    return next(
      new HttpError(
        "An error occured while deleting file , try again later",
        500
      )
    );
  }

  if (!_foundReceipt) {
    return next(new HttpError("no related files", 404));
  }

  if (_foundReceipt?.file) {
    let filePath = path.join(
      __dirname,
      "..",
      "uploadedFiles",
      _foundReceipt?.company,
      "receipts",
      _foundReceipt?.file?.split(/[\/\\]/).pop()
    );

    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log("File deleted successfully");
      } else {
        console.error("File does not exist");
      }
    } catch (err) {
      console.error(err);
    }
  }

  try {
    _relatedNotification = await ExchangeNotification.destroy({
      where: {
        actionId: _foundReceipt?.id,
        action: "add receipt",
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "err 500" });
  }

  try {
    await _foundReceipt?.destroy();
  } catch (error) {
    return res.status(500).json({ message: "err 500" });
  }

  return res
    .status(200)
    .json({ message: "The record was successfully deleted" });
};
exports.editReceipt = async (req, res, next) => {
  let _receipt;

  const { id, title, date, price } = req.body;

  if (!id || !title || !date || !price) {
    return res.status(400).send("Request body is missing or empty");
  }

  const file = req?.files[0];

  try {
    _receipt = await Receipt.findByPk(id);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "An error occured, try again later" });
  }

  if (!_receipt) {
    return next(new HttpError("No records found", 404));
  }

  if (file?.path) {
    let filePath = path.join(
      __dirname,
      "..",
      "uploadedFiles",
      _receipt?.company,
      "receipts",
      _receipt?.file?.split(/[\/\\]/).pop()
    );

    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log("File deleted successfully");
      } else {
        console.error("File does not exist");
      }
    } catch (err) {
      console.error(err);
    }
  }

  try {
    _receipt.title = title;
    _receipt.date = date;
    _receipt.price = price;
    // _receipt.file = file?.path;
    if (file?.path) {
      _receipt.file = file.path;
    }

    await _receipt.save();
  } catch (error) {
    console.log("errrrr", error);
    return res.status(500).json({ message: "err 500" });
  }

  return res
    .status(201)
    .json({ message: "The record was successfully updated" });
};
exports.addReceipt = async (req, res, next) => {
  let _exchanges, _receipt;

  const { title, date, price, exchangeId } = req.body;
  const file = req?.files[0];

  try {
    _exchanges = await Exchange.findByPk(exchangeId);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "An error occured, try again later" });
  }

  if (!_exchanges) {
    return next(new HttpError("No records found", 404));
  }

  _receipt = await Receipt.create({
    price,
    title,
    date,
    ExchangeId: exchangeId,
    company: _exchanges?.name,
    file: file?.path,
  });

  const notification = await ExchangeNotification.create({
    action: "add receipt",
    actionId: _receipt?.id,
    message: "receipt added",
    ExchangeId: exchangeId,
  });

  const _notif = await ExchangeNotification.findAll({
    where: {
      status: "unread",
      // title: "add receipt",
      // ExchangeId: exchangeId,
    },
    include: [{ model: Exchange }],
    order: [["createdAt", "DESC"]],
  });

  io.getio().emit("addReceiptClient", {
    data: _notif,
  });

  return res
    .status(200)
    .json({ message: "The record was successfully created" });
};
exports.deleteFile = async (req, res, next) => {
  const { fileId, exchangeName } = req.body;

  if (!fileId || !exchangeName) {
    return res.status(400).send("Request body is missing or empty");
  }

  let _foundRelatedFile, _relatedNotification;
  try {
    _foundRelatedFile = await ExchangeFiles.findByPk(fileId);
  } catch (error) {
    return next(
      new HttpError(
        "An error occured while deleting file , try again later",
        500
      )
    );
  }

  if (!_foundRelatedFile) {
    return next(new HttpError("no related files", 404));
  }

  try {
    _relatedNotification = await ExchangeNotification.destroy({
      where: {
        actionId: _foundRelatedFile?.id,
        action: "add new file",
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "err 500" });
  }

  await _foundRelatedFile?.destroy();

  console.log(
    "__________________________ :",
    _foundRelatedFile.image.split(/[\/\\]/).pop()
  );

  let filePath = path.join(
    __dirname,
    "..",
    "uploadedFiles",
    exchangeName,
    "files",
    _foundRelatedFile.file.split(/[\/\\]/).pop()
  );

  let imagePath = path.join(
    __dirname,
    "..",
    "uploadedFiles",
    exchangeName,
    "images",
    _foundRelatedFile.image.split(/[\/\\]/).pop()
  );

  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log("File deleted successfully");
    } else {
      console.error("File does not exist");
    }
  } catch (err) {
    console.error(err);
  }
  try {
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
      console.log("Image deleted successfully");
    } else {
      console.error("Image does not exist");
    }
  } catch (err) {
    console.error(err);
  }

  return res
    .status(200)
    .json({ message: "The record was successfully deleted" });
};
exports.updateFile = async (req, res, next) => {
  const {
    id,
    title,
    version,
    description,
    exchangeId,
    fileType,
    selectedFileType,
  } = req.body;

  if (
    !id ||
    !title ||
    !version ||
    !description ||
    !exchangeId ||
    !fileType ||
    !selectedFileType
  ) {
    return res.status(400).send("Request body is missing or empty");
  }

  console.log("reeeeeeeeeeeq", req.body);

  const file = req?.files["files"];
  const image = req?.files["images"];

  let _foundExchange = await ExchangeFiles.findByPk(id, {
    include: [{ model: Exchange }],
  });

  if (file) {
    for (const element of file) {
      if (element?.path) {
        let filePath = path.join(
          __dirname,
          "..",
          "uploadedFiles",
          _foundExchange?.Exchange?.name,
          "files",
          _foundExchange?.file?.split(/[\/\\]/).pop()
        );

        try {
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            console.log("File deleted successfully");
          } else {
            console.error("File does not exist");
          }
        } catch (err) {
          console.error(err);
        }
      }
    }
  }

  if (image) {
    for (const element of image) {
      if (element?.path) {
        let imagePath = path.join(
          __dirname,
          "..",
          "uploadedFiles",
          _foundExchange?.Exchange?.name,
          "images",
          _foundExchange?.image?.split(/[\/\\]/).pop()
        );

        try {
          if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
            console.log("img deleted successfully");
          } else {
            console.error("img does not exist");
          }
        } catch (err) {
          console.error(err);
        }
      }
    }
  }

  let resizedImagePath;
  if (image) {
    const _image = sharp(image[0]?.path);

    const metadata = await _image?.metadata();

    let oheight = metadata?.height,
      owidth = metadata?.width,
      mheight = 200,
      mwidth = 400,
      theight,
      twidth;

    let oratio = owidth / oheight, // (~1.54)
      mratio = mwidth / mheight; // (2)

    if (mratio > oratio) {
      theight = mheight;
      twidth = theight * oratio;
    } else {
      twidth = mwidth;
      theight = twidth / oratio;
    }

    resizedImagePath =
      "uploadedFiles/" +
      _foundExchange?.Exchange?.name +
      "/images/" +
      "resized-" +
      image[0]?.filename?.split(/[\/\\]/).pop();

    await sharp(image[0]?.path)
      .resize(Math.ceil(twidth), Math.ceil(theight))
      .toFile(resizedImagePath);
  }

  try {
    _foundExchange.title = title;
    _foundExchange.version = version;
    _foundExchange.description = description;
    _foundExchange.fileType = fileType;
    _foundExchange.FileTypeId = selectedFileType;
    _foundExchange.ExchangeId = exchangeId;
    file && (_foundExchange.file = file[0]?.path);
    image && (_foundExchange.image = resizedImagePath);

    await _foundExchange.save();
  } catch (error) {
    return res.status(500).send("err 500");
  }

  let directoryPath = path.join(
    __dirname,
    "..",
    "uploadedFiles",
    _foundExchange?.Exchange?.name,
    "images"
  );

  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      console.error("Unable to scan directory:", err);
      return;
    }

    files.forEach((file) => {
      if (!file.startsWith("resized")) {
        const filePath = path.join(directoryPath, file);
        fs.unlink(filePath, (err) => {
          if (err) {
            console.error(`Error deleting file ${filePath}:`, err);
          } else {
            console.log(`Successfully deleted file: ${filePath}`);
          }
        });
      }
    });
  });

  res.status(200).json({ msg: "okkk" });
};

exports.addFileType = async (req, res, next) => {
  const { fileTypeName } = req.body;
  try {
    await FileType.create({ type: fileTypeName });
  } catch (error) {
    if (error?.name === "SequelizeUniqueConstraintError") {
      return next(new HttpError("invalid name", 409));
    } else {
      return next(new HttpError("An error occured, try again later", 500));
    }
  }

  return res.status(201).json({ data: "The record added successfully." });
};

exports.getById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const _filType = await FileType.findByPk(id);

    if (!_filType) {
      return next(new HttpError("فرمت فایل مورد نظر یافت نشد. ", 404));
    }

    return res.status(200).json({ data: _filType });
  } catch (error) {
    return next(new HttpError("خطا سمت سرور .", 500));
  }
};
exports.getFileTypes = async (req, res, next) => {
  let _allFileTypes;
  try {
    _allFileTypes = await FileType.findAll({});
  } catch (error) {
    return next(new HttpError("An error occured, try again later", 500));
  }
  return res.status(200).json({ data: _allFileTypes });
};
exports.deleteFileType = async (req, res, next) => {
  const { id } = req.body;
  let _foundFileType;

  if (!id) {
    return res.status(400).send("Request body is missing or empty");
  }

  try {
    _foundFileType = await FileType.findByPk(id);
  } catch (error) {
    return next(new HttpError("An error occured, try again later", 500));
  }

  if (!_foundFileType) {
    return next(new HttpError("no related file", 404));
  }

  const relatedRecords = await ExchangeFiles.findOne({
    where: { FileTypeId: id },
  });

  if (relatedRecords) {
    return res
      .status(409)
      .json({ message: "Cannot delete: File type is in use." });
  }

  try {
    await _foundFileType.destroy();
  } catch (error) {
    return res.status(500).json({ message: "Server error while deleting" });
  }

  return res.status(200).json({ data: _foundFileType });
};

exports.editFileType = async (req, res, next) => {
  const { fileTypeId, fileTypeName } = req.body;

  if (!fileTypeId || !fileTypeName) {
    return res.status(400).send("Request body is missing or empty");
  }

  let _foundFileType;

  try {
    _foundFileType = await FileType.findByPk(fileTypeId);
  } catch (error) {
    console.log(error);

    return next(new HttpError("An error occured, try again later", 500));
  }

  if (!_foundFileType) {
    return next(new HttpError("No exchange found", 404));
  }

  try {
    _foundFileType.type = fileTypeName;
    await _foundFileType.save();
  } catch (error) {
    if (error?.name === "SequelizeUniqueConstraintError") {
      return next(
        new HttpError(
          "An error occured while updating exchange, try again later",
          403
        )
      );
    }
    return next(
      new HttpError(
        "An error occured while updating exchange, try again later",
        500
      )
    );
  }
  return res
    .status(200)
    .json({ message: "The fileType was successfully updated" });
};
//**********************************************************************************
//**********************************************************************************
//**********************************************************************************
//**********************************************************************************
//**********************************************************************************

exports.relatedFilesVersions = async (req, res, next) => {
  const _exchangeId = req.params.exchangeId;
  const _fileTypeId = req.params.fileTypeId;

  let _versions = await ExchangeFiles.findAll({
    where: {
      ExchangeId: _exchangeId,
      FileTypeId: _fileTypeId,
    },
  });

  return res.status(200).json({ data: _versions });
};

exports.relatedFiles = async (req, res, next) => {
  let _foundRelatedFile;

  const _exchangeId = req.params.exchangeId;
  let result;

  try {
    _foundRelatedFile = await ExchangeFiles.findAll({
      where: { ExchangeId: _exchangeId },
      include: [{ model: Exchange }],
      attributes: [
        "FileTypeId",
        "ExchangeId",
        "id",
        "fileType",
        "file",
        "image",
        "title",
        "version",
        "description",
        "createdAt",
      ],
      order: [["createdAt", "DESC"]],
    });

    const groupedFiles = _foundRelatedFile.reduce((acc, file) => {
      const key = `${file.FileTypeId}-${file.ExchangeId}`;
      if (!acc[key]) {
        acc[key] = file;
      }
      return acc;
    }, {});

    result = Object.values(groupedFiles);

    ///////////////////////////////////////////////////////////////
  } catch (error) {
    console.log("relatedFiles err", error);

    return next(new HttpError("An error occured, try again later", 500));
  }

  if (!result) {
    return next(new HttpError("not found", 404));
  }

  return res.status(200).json({ data: result });
};

exports.latestReceipts = async (req, res, next) => {
  let _foundReceipts;

  const _exchangeId = req.params.exchangeId;

  try {
    _foundReceipts = await Receipt.findAll({
      where: {
        ExchangeId: _exchangeId,
      },
      limit: 3,
      order: [["createdAt", "DESC"]],
    });
  } catch (error) {
    console.log(error);
    return next(new HttpError("An error occured, try again later", 500));
  }

  if (!_foundReceipts || _foundReceipts?.Receipts?.length === 0) {
    return next(new HttpError("not found", 404));
  }

  return res.status(200).json({ data: _foundReceipts });
};
exports.getReceipt = async (req, res, next) => {
  let _foundReceipt;

  const _id = req.params.id;

  try {
    _foundReceipt = await Receipt.findByPk(_id);
  } catch (error) {
    console.log(error);
    return next(new HttpError("An error occured, try again later", 500));
  }

  if (!_foundReceipt) {
    return next(new HttpError("not found", 404));
  }

  return res.status(200).json({ data: _foundReceipt });
};
