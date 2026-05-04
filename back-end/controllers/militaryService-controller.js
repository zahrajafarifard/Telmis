const MilitaryService = require("../models/military-service");
const HttpError = require("../models/http-error");

exports.add = async (req, res, next) => {
  const { newMilitaryServices } = req.body;

  if (!newMilitaryServices) {
    return res.status(400).send("Request body is missing or empty");
  }
  try {
    await MilitaryService.create({
      type: newMilitaryServices,
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
  const { militaryServiceId } = req.body;

  if (!militaryServiceId) {
    return res.status(400).send("Request body is missing or empty");
  }
  try {
    const _foundItem = await MilitaryService.findByPk(militaryServiceId);
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
  const { editingMilitaryService } = req.body;
  let _editingEmploymentType;

  if (!editingMilitaryService?.id) {
    return res.status(400).send("Request body is missing or empty");
  }
  try {
    _editingEmploymentType = await MilitaryService.findByPk(
      editingMilitaryService?.id
    );
    _editingEmploymentType.type = editingMilitaryService?.type;
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

exports.getAll = async (req, res, next) => {
  let _data;

  try {
    _data = await MilitaryService.findAll();
  } catch (error) {
    return next(new HttpError("An error occured, try again later", 500));
  }

  if (!_data) {
    return next(new HttpError("Not found", 404));
  }
  return res.status(200).json({ data: _data });
};

exports.get = async (req, res, next) => {
  const { id } = req.params;
  let _data;

  try {
    _data = await MilitaryService.findByPk(id);
  } catch (error) {
    return next(new HttpError("An error occured, try again later", 500));
  }

  if (!_data) {
    return next(new HttpError("Not found", 404));
  }
  return res.status(200).json({ data: _data });
};
