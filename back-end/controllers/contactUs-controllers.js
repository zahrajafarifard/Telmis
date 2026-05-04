const { Op } = require("sequelize");

const HttpError = require("../models/http-error");
const ContactUs = require("../models/contact-us");

exports.getComments = async (req, res, next) => {
  try {
    let offset, limit;
    const { page, pageSize } = req.body;
    offset = (page - 1) * pageSize;
    limit = pageSize;

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const _comments = await ContactUs.findAndCountAll({
      limit,
      offset,
      where: {
        createdAt: {
          [Op.gte]: sixMonthsAgo,
        },
      },
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({ data: _comments });
  } catch (error) {
    return next(new HttpError("An error occured, try again later", 500));
  }
};
exports.submitComment = async (req, res, next) => {
  try {
    const { name, mobile, message } = req.body;

    if (!name || !mobile || !message) {
      return res.status(400).json({ error: "all fields are required." });
    }

    await ContactUs.create({
      name,
      mobile,
      message,
    });

    return res.status(201).json({ message: "Comment submitted successfully." });
  } catch (error) {
    return next(new HttpError("An error occurred, try again later", 500));
  }
};
