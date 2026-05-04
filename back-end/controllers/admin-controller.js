const { Sequelize } = require("sequelize");
const { Op } = require("sequelize");
const moment = require("moment");
const HttpError = require("../models/http-error");
const View = require("../models/view");
const axios = require("axios");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Admin = require("../models/admin");

exports.setNewPassword = async (req, res, next) => {
  const { newPassword, repeatNewPassword, mobile } = req.body;

  if (!newPassword || !repeatNewPassword || !mobile) {
    return res.status(400).send("Request body is missing or empty");
  }

  if (newPassword !== repeatNewPassword) {
    return next(new HttpError("رمز عبور و تکرار آن یکسان نیستند.", 403));
  }

  let _foundUser;
  _foundUser = await Admin.findOne({ where: { mobile } });

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(newPassword, 12);
  } catch (err) {
    return next(new HttpError("خطای سمت سرور ، لطفا مجددا تلاش کنید.", 500));
  }

  _foundUser.password = hashedPassword;
  await _foundUser.save();

  return res.status(201).json({ data: "new password is set" });
};

exports.checkSecurityCode = async (req, res, next) => {
  try {
    const { securityCode, mobile } = req.body;

    if (!securityCode || !mobile) {
      return next(
        new HttpError("Mobile number and security code are required.", 400)
      );
    }

    const foundUser = await Admin.findOne({
      where: {
        mobile,
        securityCode,
      },
    });

    if (foundUser) {
      return res.status(200).json({ message: "User matched", success: true });
    } else {
      return next(new HttpError("No records found.", 404));
    }
  } catch (error) {
    console.error("Database error:", error);
    return next(new HttpError("Internal server error", 500));
  }
};

exports.generateSecurityCode = async (req, res, next) => {
  const { mobile } = req.body;

  let _randomCode, _foundUser;
  _foundUser = await Admin.findOne({ where: { mobile: mobile } });

  _randomCode = Math.floor(Math.random() * 1000000);

  if (_foundUser) {
    _foundUser.securityCode = _randomCode;
    await _foundUser.save();
  } else {
    return next(new HttpError("No records found", 404));
  }

  if (_foundUser?.securityCode) {
    // password is rag#818 but code for # is %23
    let sms;
    try {
      sms = await axios.get(
        `https://login.niazpardaz.ir/SMSInOutBox/SendSms?username=d.momeni&password=rag%23818&from=10009611&to=${mobile}&text=کد اعتبار سنجی شما: ${_randomCode}`
      );
    } catch (error) {
      return next(new HttpError("خطای سمت سرور ، لطفا مجددا تلاش کنید.", 500));
    }

    return res.status(200).json({ data: _randomCode });
  } else {
    return next(
      new HttpError(
        "An error occured while deleting file , try again later",
        500
      )
    );
  }
};

exports.login = async (req, res, next) => {
  try {
    const { mobile, password } = req.body;

    const existingUser = await Admin.findOne({
      where: { mobile: mobile },
    });

    if (!existingUser) {
      return next(new HttpError("نام کاربری یا رمز عبور اشتباه است.", 403));
    }

    let unhashedPassword;
    try {
      unhashedPassword = await bcrypt.compare(password, existingUser.password);
    } catch (err) {
      return next(new HttpError("خطای سمت سرور ، لطفا مجددا تلاش کنید.", 500));
    }
    if (!unhashedPassword) {
      return next(new HttpError("نام کاربری یا رمز عبور اشتباه است.", 403));
    }
    let token;
    try {
      token = jwt.sign(
        {
          clientId: existingUser.id,
          mobile: existingUser.mobile,
        },
        "mySecretKey :) ",
        { expiresIn: "10h" }
      );
    } catch (err) {
      return next(new HttpError("خطای سمت سرور ، لطفا مجددا تلاش کنید.", 500));
    }

    return res.status(200).json({
      // userId: existingUser.id,
      // mobile: existingUser.mobile,
      token: token,
    });
  } catch (error) {
    console.log(error);
    return next(new HttpError("error", 500));
  }
};

exports.signUp = async (req, res, next) => {
  let password = "@Telmis123qwe@";

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    console.log("err", err);
  }

  return res.status(200).send(hashedPassword);
};

exports.sendSMS = async (req, res, next) => {
  const { mobile, name } = req.body;

  if (!mobile || !name) {
    return res.status(422).send("invalid input");
  }

  let sms;

  let receiverNumber = "09352051335";
  try {
    sms = await axios.get(
      `https://login.niazpardaz.ir/SMSInOutBox/SendSms?username=d.momeni&password=rag%23818&from=10009611&to=${receiverNumber}&text= موبایل: ${mobile} %0A نام: ${name}`
    );

    return res.status(200).send("SMS sent successfully");
  } catch (error) {
    return next(new HttpError("خطای سمت سرور ، لطفا مجددا تلاش کنید.", 500));
  }
};

exports.getAllVisits = async (req, res, next) => {
  try {
    // const findIndexOfIp = await req.headers["x-forwarded-for"];
    // const findIndexOfIp = await req.ip;

    const findIndexOfIp =
      req.headers["x-forwarded-for"] || req.socket.remoteAddress || req.ip;

    let isSameOrBeforeThan5Minuts;

    const _foundVisitor = await View.findOne({
      where: {
        ip: findIndexOfIp,
        [Op.and]: [
          Sequelize.where(
            Sequelize.fn("DAY", Sequelize.col("createdAt")),
            moment().format("DD")
          ),
          Sequelize.where(
            Sequelize.fn("MONTH", Sequelize.col("createdAt")),
            moment().format("MM")
          ),
          Sequelize.where(
            Sequelize.fn("YEAR", Sequelize.col("createdAt")),
            moment().format("YYYY")
          ),
        ],
      },
    });

    if (_foundVisitor !== null) {
      isSameOrBeforeThan5Minuts = moment(
        moment(Date.now()).subtract(5, "minutes")
      ).isSameOrBefore(_foundVisitor.dataValues.updatedAt, "minutes");
    }

    let createdVisior;
    if (_foundVisitor == null) {
      createdVisior = await View.create({
        ip: findIndexOfIp,
        count: 1,
      });
    }

    if (_foundVisitor && !isSameOrBeforeThan5Minuts) {
      _foundVisitor.count = (await _foundVisitor.count) + 1;
      await _foundVisitor.save();
    }

    const todayVisitors = await View.findAll({
      where: {
        [Op.and]: [
          Sequelize.where(
            Sequelize.fn("DAY", Sequelize.col("createdAt")),
            moment().format("DD")
          ),
          Sequelize.where(
            Sequelize.fn("MONTH", Sequelize.col("createdAt")),
            moment().format("MM")
          ),
          Sequelize.where(
            Sequelize.fn("YEAR", Sequelize.col("createdAt")),
            moment().format("YYYY")
          ),
        ],
      },
    });

    let allTodayVisitors = 0;
    todayVisitors.map((visitor) => {
      allTodayVisitors = +allTodayVisitors + +visitor.dataValues.count;
    });

    const totalCount = await View.findAll({
      attributes: [[Sequelize.fn("sum", Sequelize.col("count")), "count"]],
      raw: true,
    });

    res.status(200).send({ allTodayVisitors, total: +totalCount[0].count });
    // next(new Error(findIndexOfIp));
  } catch (error) {
    return next(new HttpError("خطای سمت سرور ، لطفا مجددا تلاش کنید.", 500));
  }
};

exports.adminProfile = async (req, res, next) => {
  let _data;

  try {
    _data = await Admin.findByPk(req.userId);
  } catch (error) {
    return next(new HttpError("An error occured, try again later", 500));
  }

  if (!_data) {
    return next(new HttpError("Not found", 404));
  }

  return res.status(200).json({ data: _data });
};
exports.updateCredential = async (req, res, next) => {
  let _data, hashedPassword;
  const { username, mobile, password } = req.body.admin;

  try {
    _data = await Admin.findByPk(req.userId);
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (error) {
    return next(new HttpError("An error occured, try again later", 500));
  }

  if (!_data) {
    return next(new HttpError("Not found", 404));
  }
  try {
    _data.username = username;
    _data.mobile = mobile;
    _data.password = hashedPassword;
    await _data.save();
  } catch (error) {
    return next(new HttpError("An error occured, try again later", 500));
  }

  return res.status(200).json({ data: _data });
};
