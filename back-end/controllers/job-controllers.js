const HttpError = require("../models/http-error");
const Job = require("../models/job");
const ArticleType = require("../models/articleType");
const EmploymentType = require("../models/employment-type");
const { Op } = require("sequelize");

exports.getRelatedJobs = async (req, res, next) => {
  let _data;
  const { articleTypeId, articleId, employmentType } = req.body;

  let whereClause = {
    id: {
      [Op.ne]: articleId,
    },
    ArticleTypeId: articleTypeId,
  };

  if (employmentType !== 0) {
    whereClause.EmploymentTypeId = employmentType;
  }

  try {
    _data = await Job.findAll({
      limit: 3,
      where: whereClause,

      attributes: ["id", "title", "minSalary", "createdAt"],
      include: [{ model: ArticleType }, { model: EmploymentType }],

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

exports.getJobsBySite = async (req, res, next) => {
  let _data;
  let whereClause = {};
  const { page, pageSize, employmentType } = req.body;

  offset = (page - 1) * pageSize;
  limit = pageSize;
  if (employmentType !== 0) {
    whereClause.EmploymentTypeId = employmentType;
  }
  try {
    _data = await Job.findAndCountAll({
      limit,
      offset,
      attributes: ["id", "title", "minSalary", "createdAt"],
      include: [{ model: ArticleType }, { model: EmploymentType }],
      where: whereClause,
      distinct: true,
      order: [["createdAt", "DESC"]],
    });
  } catch (error) {
    console.log(error);

    return next(new HttpError("An error occured, try again later", 500));
  }

  // if (_data?.count === 0) {
  //   return next(new HttpError("Not found", 404));
  // }
  return res.status(200).json({ data: _data });
};
exports.getJobsByAdmin = async (req, res, next) => {
  let _data;
  const { page, pageSize } = req.body;

  offset = (page - 1) * pageSize;
  limit = pageSize;

  try {
    _data = await Job.findAndCountAll({
      limit,
      offset,
      attributes: ["id", "title", "minSalary", "createdAt"],
      include: [{ model: ArticleType }, { model: EmploymentType }],
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
exports.getJobs = async (req, res, next) => {
  let _data;
  const { employmentType } = req.body;
  const { page, pageSize } = req.body;

  offset = (page - 1) * pageSize;
  limit = pageSize;

  const _whereCondition = {
    EmploymentTypeId: {
      [Op.ne]: 0,
    },
  };

  if (employmentType !== 0) {
    _whereCondition.EmploymentTypeId[Op.eq] = employmentType;
  }

  try {
    _data = await Job.findAndCountAll({
      limit,
      offset,
      attributes: ["id", "title", "minSalary", "createdAt"],
      where: _whereCondition,
      include: [{ model: ArticleType }, { model: EmploymentType }],
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

exports.getEmploymentTypes = async (req, res, next) => {
  let _emps;
  try {
    _emps = await EmploymentType.findAll();
  } catch (error) {
    console.log(error);
  }

  return res.status(200).json({ data: _emps });
};

exports.getJob = async (req, res, next) => {
  let _data;
  const { id } = req.params;

  try {
    _data = await Job.findByPk(id, {
      // attributes: [
      //   "id",
      //   "title",
      //   "duties",
      //   // "pros",
      //   "conditions",
      //   "duties",
      // ],
      include: [{ model: ArticleType }],
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

exports.getJobByAdmin = async (req, res, next) => {
  let _data;
  const { id } = req.params;

  try {
    _data = await Job.findByPk(id, {
      include: [{ model: ArticleType }, { model: EmploymentType }],
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

exports.searchJob = async (req, res, next) => {
  const { searchItem, page, pageSize } = req.body;

  let _jobs;

  offset = (page - 1) * pageSize;
  limit = pageSize;

  try {
    _jobs = await Job.findAndCountAll({
      limit,
      offset,
      attributes: ["id", "title", "minSalary", "createdAt"],
      include: [{ model: ArticleType }, { model: EmploymentType }],
      distinct: true,
      order: [["createdAt", "DESC"]],
      where: {
        [Op.or]: [{ title: { [Op.like]: `%${searchItem}%` } }],
      },
    });
  } catch (error) {
    console.log("eeee", error);
  }

  if (_jobs?.count === 0) {
    return res.status(404).json({ data: "Not Found" });
  }

  return res.status(200).json({ data: _jobs });
};
exports.editJob = async (req, res, next) => {
  const {
    id,
    title,
    duties,
    minSalary,
    workExperience,
    educationRequirement,
    categoryId,
    employmentId,
    gender,
    militaryServiceId,
  } = req.body;

  let _editingJob;
  try {
    _editingJob = await Job.findByPk(id);

    if (!_editingJob) {
      return res.status(404).json({ message: "not found" });
    }
    _editingJob.title = title;
    _editingJob.duties = duties;
    _editingJob.minSalary = minSalary;
    _editingJob.workExperience = workExperience;
    _editingJob.educationRequirement = educationRequirement;
    _editingJob.ArticleTypeId = categoryId;
    _editingJob.EmploymentTypeId = employmentId;
    _editingJob.gender = gender;
    _editingJob.MilitaryServiceId = militaryServiceId;

    await _editingJob.save();

    return res.status(201).send("job was successfully created");
  } catch (error) {
    console.error(error);
    return next(new HttpError("An error occured, try again later", 500));
  }
};
exports.addJob = async (req, res, next) => {
  try {
    const {
      title,
      minSalary,
      categoryId,
      employmentId,
      duties,
      workExperience,
      educationRequirement,
      gender,
      militaryService,
    } = req.body;

    await Job.create({
      title,
      minSalary,
      gender,
      ArticleTypeId: categoryId,
      EmploymentTypeId: employmentId,
      MilitaryServiceId: militaryService,
      duties,
      workExperience,
      educationRequirement,
    });

    res.status(201).send("job was successfully created");
  } catch (error) {
    console.error(error);
    next(new HttpError("An error occured, try again later", 500));
  }
};

exports.deleteJob = async (req, res, next) => {
  const { id } = req.body;

  try {
    const _foundJob = await Job.findByPk(id);

    if (!_foundJob) {
      return res.status(404).json({ message: "Not Found" });
    }

    await _foundJob.destroy({});

    return res.status(200).json({ message: "The job has been deleted." });
  } catch (error) {
    return next(new HttpError("An error occured, try again later", 500));
  }
};
