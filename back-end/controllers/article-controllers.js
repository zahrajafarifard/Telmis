const path = require("path");
const fs = require("fs");
const { Op } = require("sequelize");

const HttpError = require("../models/http-error");
const Article = require("../models/article");
const ArticleType = require("../models/articleType");
const sequelize = require("../db");

setInterval(deleteOldFiles, 24 * 60 * 60 * 1000);
// setInterval(deleteOldFiles, 5000);

async function deleteOldFiles() {
  try {
    const FolderPath = path.join(__dirname, "..", "uploads", "article");

    const articles = await Article.findAll();

    const validFiles = new Set([
      ...articles
        .map((article) =>
          article.mainImage ? path.basename(article.mainImage) : null
        )
        .filter(Boolean),
      ...articles
        .map((article) =>
          article.sectionTwoImage
            ? path.basename(article.sectionTwoImage)
            : null
        )
        .filter(Boolean),
    ]);

    const allFiles = fs.readdirSync(FolderPath);

    for (const file of allFiles) {
      const filePath = path.join(FolderPath, file);
      if (!validFiles.has(file)) {
        fs.unlinkSync(filePath);
        console.log(`Deleted orphaned file: ${filePath}`);
      }
    }

    console.log("Old files deleted successfully!");
  } catch (err) {
    console.error("Error deleting old files:", err);
  }
}

exports.getArticleSite = async (req, res, next) => {
  let _data;
  const { id } = req.params;

  try {
    _data = await Article.findByPk(id, {
      include: [{ model: ArticleType }],
    });
  } catch (error) {
    console.log(error);

    return next(new HttpError("An error occured, try again later", 500));
  }

  _data.view = _data.view + 1;
  await _data.save();

  if (!_data) {
    return next(new HttpError("Not found", 404));
  }
  return res.status(200).json({ data: _data });
};

exports.articlesWithoutConditions = async (req, res, next) => {
  let _data, offset, limit;
  const { page, pageSize } = req.body;
  offset = (page - 1) * pageSize;
  limit = pageSize;

  try {
    _data = await Article.findAndCountAll({
      limit,
      offset,
      attributes: [
        "id",
        "articleTitle",
        "author",
        "shortDescription",
        "mainImage",
        "createdAt",
      ],

      include: [{ model: ArticleType }],
      distinct: true,
      order: [["createdAt", "DESC"]],
    });
  } catch (error) {
    console.log(error);

    return next(new HttpError("An error occured, try again later", 500));
  }

  if (!_data) {
    return next(new HttpError("Not found", 404));
  }
  return res.status(200).json({ data: _data });
};

exports.getArticles = async (req, res, next) => {
  let _data, offset, limit;
  const { item, page, pageSize } = req.body;

  offset = (page - 1) * pageSize;
  limit = pageSize;

  // sort:
  // 1: most visited
  // 2: newset
  // 3: oldest

  let orderFeild;
  let orderValue;

  switch (+item) {
    case 1:
      orderFeild = "view";
      orderValue = "DESC";
      break;
    case 2:
      orderFeild = "createdAt";
      orderValue = "DESC";
      break;
    case 3:
      orderFeild = "createdAt";
      orderValue = "ASC";
      break;

    default:
      orderFeild = "createdAt";
      orderValue = "DESC";
      break;
  }
  try {
    _data = await Article.findAndCountAll({
      limit,
      offset,
      attributes: [
        "id",
        "articleTitle",
        "author",
        "shortDescription",
        "mainImage",
        "createdAt",
      ],

      include: [{ model: ArticleType }],
      distinct: true,
      order: [[orderFeild, orderValue]],
    });
  } catch (error) {
    console.log(error);

    return next(new HttpError("An error occured, try again later", 500));
  }

  if (!_data) {
    return next(new HttpError("Not found", 404));
  }
  return res.status(200).json({ data: _data });
};

exports.sameTypeArticles = async (req, res, next) => {
  let _data, limit, offset;

  const { item, page, pageSize } = req.body;

  offset = (page - 1) * pageSize;
  limit = pageSize;

  try {
    _data = await Article.findAndCountAll({
      where: { ArticleTypeId: +item },
      limit,
      offset,
      attributes: [
        "id",
        "articleTitle",
        "author",
        "shortDescription",
        "mainImage",
        "createdAt",
      ],

      include: [{ model: ArticleType }],
      distinct: true,
      order: [["createdAt", "DESC"]],
    });
  } catch (error) {
    console.log(error);

    return next(new HttpError("An error occured, try again later", 500));
  }

  if (!_data) {
    return next(new HttpError("Not found", 404));
  }
  return res.status(200).json({ data: _data });
};

exports.searchArticle = async (req, res, next) => {
  const {
    searchItem,

    page,
    pageSize,
  } = req.body;
  let _articles;

  offset = (page - 1) * pageSize;
  limit = pageSize;

  try {
    _articles = await Article.findAndCountAll({
      limit,
      offset,
      attributes: ["id", "articleTitle", "author", "mainImage", "createdAt"],
      include: [{ model: ArticleType }],
      distinct: true,
      order: [["createdAt", "DESC"]],
      where: {
        [Op.or]: [{ articleTitle: { [Op.like]: `%${searchItem}%` } }],
      },
    });
  } catch (error) {
    console.log("eeee", error);
  }

  if (_articles?.count === 0) {
    return res.status(404).json({ data: "Not Found" });
  }

  return res.status(200).json({ data: _articles });
};

exports.getArticleTypes = async (req, res, next) => {
  let _emps;
  try {
    _emps = await ArticleType.findAll();
  } catch (error) {
    console.log(error);
  }

  return res.status(200).json({ data: _emps });
};

exports.getMostVisitedArticles = async (req, res, next) => {
  let _data;

  try {
    _data = await Article.findAll({
      limit: 3,

      attributes: [
        "id",
        "articleTitle",
        "author",
        "shortDescription",
        "mainImage",
        "createdAt",
      ],

      include: [{ model: ArticleType }],
      distinct: true,
      order: [["view", "DESC"]],
    });
  } catch (error) {
    console.log(error);

    return next(new HttpError("An error occured, try again later", 500));
  }

  if (!_data) {
    return next(new HttpError("Not found", 404));
  }
  return res.status(200).json({ data: _data });
};

exports.getAllArticles = async (req, res, next) => {
  let _data;

  try {
    _data = await Article.findAll({
      limit: 3,

      attributes: [
        "id",
        "articleTitle",
        "author",
        "shortDescription",
        "mainImage",
        "createdAt",
      ],

      include: [{ model: ArticleType }],
      distinct: true,
      order: [["createdAt", "DESC"]],
    });
  } catch (error) {
    console.log(error);

    return next(new HttpError("An error occured, try again later", 500));
  }

  if (!_data) {
    return next(new HttpError("Not found", 404));
  }
  return res.status(200).json({ data: _data });
};

exports.getLatestArticles = async (req, res, next) => {
  let _data;
  // const { page, pageSize } = req.body;

  // offset = (page - 1) * pageSize;
  // limit = pageSize;

  try {
    _data = await Article.findAll({
      limit: 3,
      // offset,
      attributes: ["id", "articleTitle", "author", "mainImage", "createdAt"],
      include: [{ model: ArticleType }],
      distinct: true,
      order: [["createdAt", "DESC"]],
    });
  } catch (error) {
    console.log(error);

    return next(new HttpError("An error occured, try again later", 500));
  }

  if (_data?.count === 0) {
    return next(new HttpError("Not found", 404));
  }
  return res.status(200).json({ data: _data });
};

exports.deleteArticle = async (req, res, next) => {
  const { articleId } = req.body;
  const _session = await sequelize.transaction();

  try {
    const _foundArticle = await Article.findByPk(articleId, {
      transaction: _session,
    });

    if (!_foundArticle) {
      await _session.rollback();
      return res.status(404).json({ message: "مقاله ای یافت نشد" });
    }

    const filePaths = [
      _foundArticle?.mainImage &&
        path.join(
          __dirname,
          "..",
          "uploads",
          "article",
          _foundArticle.mainImage
        ),
      _foundArticle?.sectionTwoImage &&
        path.join(
          __dirname,
          "..",
          "uploads",
          "article",
          _foundArticle.sectionTwoImage
        ),
    ].filter(Boolean);

    for (const filePath of filePaths) {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log(`Deleted file: ${filePath}`);
      } else {
        console.log(`File does not exist: ${filePath}`);
      }
    }

    await _foundArticle.destroy({ transaction: _session });
    await _session.commit();

    return res.status(200).json({ message: "The article has been deleted." });
  } catch (error) {
    await _session.rollback();
    console.error("Error deleting article:", error);
    return res
      .status(500)
      .json({ message: "خطای سمت سرور ، لطفا مجددا تلاش کنید" });
  }
};

exports.getArticle = async (req, res, next) => {
  let _foundArticle;
  const { articleId } = req.params;

  try {
    _foundArticle = await Article.findByPk(articleId);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "خطای سمت سرور ، لطفا مجددا تلاش کنید" });
  }

  if (!_foundArticle) {
    return res.status(404).json({ message: "مقاله ای یافت نشد" });
  }

  return res.status(200).json({ data: _foundArticle });
};

exports.addArticle = async (req, res, next) => {
  const {
    articleTitle,
    shortDescription,
    authorName,
    sectionOneTitle,
    sectionOneText,
    sectionTwoTitle,
    sectionTwoText,
    sectionThreeTitle,
    sectionThreeText,

    category,
  } = req.body;

  const mainImage = req.files["mainImage"]
    ? req.files["mainImage"][0].filename
    : null;
  const sectionTwoImage = req.files["sectionTwoImage"]
    ? req.files["sectionTwoImage"][0].filename
    : null;

  try {
    const newArticle = await Article.create({
      ArticleTypeId: +category,
      articleTitle,
      shortDescription,
      author: authorName,
      sectionOneTitle,
      sectionOneText,
      sectionTwoTitle,
      sectionTwoText,
      sectionThreeTitle,
      sectionThreeText,

      mainImage,
      sectionTwoImage,
    });

    return res.status(201).send("Article was successfully created");
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Error saving article to the database." });
  }
};

exports.editArticle = async (req, res, next) => {
  const {
    articleId,
    articleTitle,
    shortDescription,
    authorName,
    sectionOneTitle,
    sectionOneText,
    sectionTwoTitle,
    sectionTwoText,
    sectionThreeTitle,
    sectionThreeText,
    category,
  } = req.body;

  const mainImage = req.files["mainImage"]?.[0]?.filename;
  const sectionTwoImage = req.files["sectionTwoImage"]?.[0]?.filename;

  const _session = await sequelize.transaction();

  try {
    const _finddedArticle = await Article.findOne({
      where: { id: articleId },
      transaction: _session,
    });

    if (!_finddedArticle) {
      await _session.rollback();
      return res.status(404).json({ message: "مقاله ای یافت نشد" });
    }

    if (mainImage) {
      _finddedArticle.mainImage = mainImage; // Assign new value if mainImage is not null
    }
    if (sectionTwoImage) {
      _finddedArticle.sectionTwoImage = sectionTwoImage; // Assign new value if mainImage is not null
    }

    Object.assign(_finddedArticle, {
      articleTitle,
      shortDescription,
      author: authorName,
      sectionOneTitle,
      sectionOneText,
      sectionTwoTitle,
      sectionTwoText,
      sectionThreeTitle,
      sectionThreeText,
      ArticleTypeId: +category,
    });

    await _finddedArticle.save({ transaction: _session });

    await _session.commit();
    return res
      .status(201)
      .json({ message: "The article has been successfully updated." });
  } catch (error) {
    await _session.rollback();
    console.error("Error updating article:", error);
    return res
      .status(500)
      .json({ message: "خطای سمت سرور ، لطفا مجددا تلاش کنید" });
  }
};
