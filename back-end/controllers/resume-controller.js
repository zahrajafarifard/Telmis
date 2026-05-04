const { Op } = require("sequelize");

const HttpError = require("../models/http-error");
const Resume = require("../models/resume");

// const sequelize = require("../db");
const path = require("path");
const fs = require("fs");

setInterval(deleteOldResumes, 24 * 60 * 60 * 1000);
// setInterval(deleteOldResumes, 5000);

async function deleteOldResumes() {
  try {
    const twoMonthsAgo = new Date();
    twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);

    const resumeFolderPath = path.join(__dirname, "..", "uploads", "resume");

    const _resumes = await Resume.findAll({});

    const oldResumes = await Resume.findAll({
      where: {
        updatedAt: { [Op.lt]: twoMonthsAgo }, // Older than two months
      },
    });

    for (const resume of oldResumes) {
      await resume.destroy({});
    }

    const validResumeFiles = new Set(
      _resumes.map((resume) => path.basename(resume.file))
    );
    const allFiles = fs.readdirSync(resumeFolderPath);

    for (const file of allFiles) {
      const filePath = path.join(resumeFolderPath, file);
      if (!validResumeFiles.has(file)) {
        fs.unlinkSync(filePath);
        console.log(`Deleted orphaned file: ${filePath}`);
      }
    }

    console.log("Old resumes deleted successfully!");
  } catch (err) {
    console.error("Error deleting old resumes:", err);
  }
}

exports.uploadCV = async (req, res) => {
  try {
    const { mobile, name, lastName, email } = req.body;

    if (!req.files?.resume || !mobile || !name || !lastName || !email) {
      return res.status(400).json({ message: "invalid request" });
    }

    const existingResume = await Resume.findOne({ where: { mobile } });

    if (existingResume && existingResume.file) {
      // update existing record
      await existingResume.update({
        name,
        lastName,
        email,
        file: req.files?.resume[0]?.path,
        resume_status: "pending",
      });
    } else {
      // create new record
      await Resume.create({
        mobile,
        name,
        lastName,
        email,
        file: req.files?.resume[0]?.path,
      });
    }

    res.status(200).json({ message: "Resume uploaded successfully" });
  } catch (err) {
    return next(new HttpError("An error occured , please try again", 500));
  }
};

exports.downloadResumes = async (req, res, next) => {
  let _foundResume;

  try {
    const _id = req.params.id;
    _foundResume = await Resume.findByPk(_id);

    let filePath = path.join(
      __dirname,
      "..",
      "uploads",
      "resume",
      _foundResume?.file?.split(/[\/\\]/).pop()
    );

    const extractFileName = async (fullName) => {
      const baseName = fullName;
      const extension = fullName.split(".").pop(); // Get the file extension (after the dot)

      return `${baseName}.${extension}`; // Combine base name with extension
    };

    const fileName = await extractFileName(
      _foundResume?.file?.split(/[\/\\]/).pop()
    );

    res.setHeader("Content-Disposition", `attachment; filename=${fileName}`);
    res.download(filePath, fileName, (err) => {
      if (err) {
        console.log(err);
        res.status(404).send("File not found");
      }
    });
  } catch (error) {
    console.log("eeeee", error);

    return next(new HttpError("An error occured , please try again", 500));
  }
};
exports.deleteResumes = async (req, res, next) => {
  const { resumes } = req.body;

  let _foundResume;

  for (const resume of resumes) {
    _foundResume = await Resume.findByPk(resume.id);

    if (!_foundResume) {
      return next(new HttpError("Resume not found", 404));
    }

    try {
      await _foundResume.destroy();
    } catch (error) {
      return next(new HttpError("An error occured , please try again", 500));
    }
  }

  return res.status(200).json({ msg: "resumes were deleted successfully" });
};
exports.deleteResume = async (req, res, next) => {
  const { id } = req.params;

  let _foundResume;

  try {
    _foundResume = await Resume.findByPk(id);

    if (!_foundResume) {
      return next(new HttpError("Resume not found", 404));
    }

    await _foundResume.destroy();
    return res.status(200).json({ msg: "resume was deleted successfully" });
  } catch (error) {
    console.log("eeee", error);
    return next(new HttpError("An error occured , please try again", 500));
  }
};
exports.acceptResumes = async (req, res, next) => {
  const { resumes } = req.body;

  let _foundResume;

  for (const resume of resumes) {
    _foundResume = await Resume.findByPk(resume.id);

    if (!_foundResume) {
      return next(new HttpError("Resume not found", 404));
    }

    try {
      _foundResume.resume_status = "accepted";
      await _foundResume.save();
    } catch (error) {
      return next(new HttpError("An error occured , please try again", 500));
    }
  }

  return res.status(200).json({ msg: "resumes were updated successfully" });
};
exports.refuseResumes = async (req, res, next) => {
  const { resumes } = req.body;

  let _foundResume;

  for (const resume of resumes) {
    _foundResume = await Resume.findByPk(resume.id);

    if (!_foundResume) {
      return next(new HttpError("Resume not found", 404));
    }

    try {
      _foundResume.resume_status = "refused";
      await _foundResume.save();
    } catch (error) {
      return next(new HttpError("An error occured , please try again", 500));
    }
  }
  return res.status(200).json({ msg: "resumes were refused successfully" });
};

exports.refuseResume = async (req, res, next) => {
  try {
    const { id } = req.params;

    const _resume = await Resume.findByPk(id);

    _resume.resume_status = "refused";
    await _resume.save();

    return res
      .status(200)
      .json({ data: "the resume successfully updated ..." });
  } catch (error) {
    return next(
      new HttpError(
        "An error occurred while updating resume, try again later",
        500
      )
    );
  }
};
exports.acceptResume = async (req, res, next) => {
  try {
    const { id } = req.params;

    const _resume = await Resume.findByPk(id);

    _resume.resume_status = "accepted";
    await _resume.save();
    return res
      .status(200)
      .json({ data: "the resume successfully updated ..." });
  } catch (error) {
    return next(
      new HttpError(
        "An error occurred while updating resume, try again later",
        500
      )
    );
  }
};
exports.acceptedResumes = async (req, res, next) => {
  try {
    const { page, pageSize } = req.body;

    offset = (page - 1) * pageSize;
    limit = pageSize;

    const _resumes = await Resume.findAndCountAll({
      limit,
      offset,
      where: {
        resume_status: "accepted",
      },
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({ data: _resumes });
  } catch (error) {
    return next(
      new HttpError(
        "An error occurred while updating resumes, try again later",
        500
      )
    );
  }
};
exports.refusedResumes = async (req, res, next) => {
  try {
    const { page, pageSize } = req.body;

    offset = (page - 1) * pageSize;
    limit = pageSize;

    const _resumes = await Resume.findAndCountAll({
      limit,
      offset,
      where: {
        resume_status: "refused",
      },
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({ data: _resumes });
  } catch (error) {
    return next(
      new HttpError(
        "An error occurred while updating resumes, try again later",
        500
      )
    );
  }
};
exports.getResume = async (req, res, next) => {
  try {
    const { id } = req.params;

    const _cv = await Resume.findByPk(id, {
      attributes: ["file"],
    });

    return res.status(200).json({ data: _cv?.file?.split(/[\/\\]/).pop() });
  } catch (error) {
    console.log("eeeeee", error);

    return next(
      new HttpError(
        "An error occurred while updating resume, try again later",
        500
      )
    );
  }
};
exports.getResumes = async (req, res, next) => {
  try {
    const { page, pageSize } = req.body;

    offset = (page - 1) * pageSize;
    limit = pageSize;

    const _resumes = await Resume.findAndCountAll({
      limit,
      offset,
      where: {
        resume_status: "pending",
      },
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({ data: _resumes });
  } catch (error) {
    return next(
      new HttpError(
        "An error occurred while updating resumes, try again later",
        500
      )
    );
  }
};
