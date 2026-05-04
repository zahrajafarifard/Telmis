const EmploymentType = require("../models/employment-type");
const HttpError = require("../models/http-error");

exports.add = async (req, res, next) => {
  const { newEmploymentType } = req.body;

  if (!newEmploymentType) {
    return res.status(400).send("Request body is missing or empty");
  }
  try {
    await EmploymentType.create({
      type: newEmploymentType,
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

exports.delete = async (req, res, next) => {
  const { employmentId } = req.body;

  if (!employmentId) {
    return res.status(400).send("Request body is missing or empty");
  }
  try {
    const _foundItem = await EmploymentType.findByPk(employmentId);
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
  const { editingEmploymentType } = req.body;
  let _editingEmploymentType;

  if (!editingEmploymentType?.id) {
    return res.status(400).send("Request body is missing or empty");
  }
  try {
    _editingEmploymentType = await EmploymentType.findByPk(
      editingEmploymentType?.id
    );
    _editingEmploymentType.type = editingEmploymentType?.type;
    await _editingEmploymentType.save();
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
    _data = await EmploymentType.findByPk(id);
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
    _data = await EmploymentType.findAll();
  } catch (error) {
    return next(new HttpError("An error occured, try again later", 500));
  }

  if (!_data) {
    return next(new HttpError("Not found", 404));
  }
  return res.status(200).json({ data: _data });
};
