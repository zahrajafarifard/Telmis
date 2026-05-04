const ArticleType = require("../models/articleType");
const HttpError = require("../models/http-error");

exports.delete = async (req, res, next) => {
  const { categoryId } = req.body;

  if (!categoryId) {
    return res.status(400).send("Request body is missing or empty");
  }
  try {
    const _foundItem = await ArticleType.findByPk(categoryId);
    await _foundItem.destroy();
  } catch (error) {
    if (error?.name === "SequelizeForeignKeyConstraintError") {
      return next(new HttpError("An error occured, try again later", 409));
    } else {
      return next(new HttpError("An error occured, try again later", 500));
    }
  }

  return res.status(200).json({ data: "Record deleted successfully " });
};

exports.edit = async (req, res, next) => {
  const { editingCategory } = req.body;
  let _editingArticleType;

  if (!editingCategory?.id) {
    return res.status(400).send("Request body is missing or empty");
  }
  try {
    _editingArticleType = await ArticleType.findByPk(editingCategory?.id);
    _editingArticleType.type = editingCategory?.type;
    await _editingArticleType.save();
  } catch (error) {
    if (error?.name === "SequelizeUniqueConstraintError") {
      return next(new HttpError("invalid name", 409));
    } else {
      return next(new HttpError("An error occured, try again later", 500));
    }
  }

  return res.status(201).json({ data: "Record successfully created" });
};

exports.add = async (req, res, next) => {
  const { newCategory } = req.body;

  if (!newCategory) {
    return res.status(400).send("Request body is missing or empty");
  }
  try {
    await ArticleType.create({
      type: newCategory,
    });
  } catch (error) {
    if (error?.name === "SequelizeUniqueConstraintError") {
      return next(new HttpError("invalid name", 409));
    } else {
      return next(new HttpError("An error occured, try again later", 500));
    }
  }

  return res.status(201).json({ data: "Record successfully created" });
};

exports.get = async (req, res, next) => {
  const { id } = req.params;
  let _data;

  try {
    _data = await ArticleType.findByPk(id);
  } catch (error) {
    return next(new HttpError("An error occured, try again later", 500));
  }

  if (!_data) {
    return next(new HttpError("Not found", 404));
  }
  return res.status(200).json({ data: _data });
};

exports.getAll = async (req, res, next) => {
  let _data;

  try {
    _data = await ArticleType.findAll();
  } catch (error) {
    return next(new HttpError("An error occured, try again later", 500));
  }

  if (!_data) {
    return next(new HttpError("Not found", 404));
  }
  return res.status(200).json({ data: _data });
};
