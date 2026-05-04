const Category = require("../models/category");
const Product = require("../models/product");
const ProductImage = require("../models/product-image");
const sequelize = require("../db");
const HttpError = require("../models/http-error");
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const { Op } = require("sequelize");

exports.delete = async (req, res, next) => {
  let deletedCategory;
  const categoryId = +req.params.categoryId;

  const _session = await sequelize.transaction();

  try {
    deletedCategory = await Category.findByPk(
      categoryId,
      {
        include: [
          { model: Product, as: "products" },
          { model: Category, as: "parent" },
        ],
      },

      {
        transaction: _session,
      }
    );

    if (!deletedCategory) {
      await _session.rollback();
      return next(new HttpError("دسته بندی مورد نظر یافت نشد.", 404));
    }

    if (deletedCategory?.products?.length !== 0) {
      await _session.rollback();
      return next(
        new HttpError("شما قادر به حذف دسته بندی مورد نظر نیستید.", 403)
      );
    }
    if (deletedCategory.parentId === null) {
      const _foundCat = await Category.findAll(
        {
          where: { parentId: categoryId },
          include: [
            { model: Product, as: "products" },
            { model: Category, as: "parent" },
          ],
        },

        {
          transaction: _session,
        }
      );

      if (_foundCat !== null && _foundCat?.length !== 0) {
        await _session.rollback();
        return next(
          new HttpError("شما قادر به حذف دسته بندی مورد نظر نیستید.", 403)
        );
      }
    }

    const path = deletedCategory?.image;

    if (path != null) {
      fs.unlink(path, (err) => {
        if (err) {
          console.error("err delete file", err);
        } else {
          console.log("File removed", deletedCategory.image);
        }
      });
    }

    await deletedCategory.destroy({
      transaction: _session,
    });
    await _session.commit();
    return res
      .status(200)
      .json({ message: "Category has been deleted successfully." });
  } catch (err) {
    console.log(err);
    await _session.rollback();
    return next(new HttpError("خطا در حذف دسته بندی .", 500));
  }
};

exports.getAll = async (req, res, next) => {
  try {
    const categories = await Category.findAll({
      include: [{ model: Category, as: "parent" }],
      order: [["parentId", "ASC"]],
    });

    if (!categories) {
      return next(new HttpError("دسته بندی مورد نظر یافت نشد. ", 404));
    }

    return res.status(200).json({ data: categories });
  } catch (error) {
    return next(new HttpError("خطا سمت سرور .", 500));
  }
};

// exports.getParents = async (req, res, next) => {
//   try {
//     const parents = await Category.findAll({
//       where: { parentId: null },
//     });

//     if (!parents) {
//       return next(new HttpError("دسته بندی مورد نظر یافت نشد. ", 404));
//     }

//     return res.status(200).json({ data: parents });
//   } catch (error) {
//     return next(new HttpError("خطا سمت سرور .", 500));
//   }
// };
exports.getParents = async (req, res, next) => {
  try {
    const parents = await Category.findAll({
      where: { parentId: null },
      include: [
        {
          model: Category,
          as: "subCategories",

          // include: [
          //   {
          //     model: Product,
          //     as: "products",
          //   },
          // ],
        },
      ],
    });

    if (!parents) {
      return next(new HttpError("دسته بندی مورد نظر یافت نشد. ", 404));
    }

    return res.status(200).json({ data: parents });
  } catch (error) {
    return next(new HttpError("خطا سمت سرور .", 500));
  }
};
exports.allParents = async (req, res, next) => {
  try {
    const parents = await Category.findAll();

    if (!parents) {
      return next(new HttpError("دسته بندی مورد نظر یافت نشد. ", 404));
    }

    return res.status(200).json({ fetchData: parents });
  } catch (error) {
    return next(new HttpError("خطا سمت سرور .", 500));
  }
};
exports.getAllSubCategories = async (req, res, next) => {
  try {
    const parents = await Category.findAll({
      where: {
        parentId: { [Op.ne]: null },
        // parentId: categoryId,
      },
      order: [["parentId", "ASC"]],
    });

    if (!parents) {
      return next(new HttpError("دسته بندی مورد نظر یافت نشد. ", 404));
    }
    return res.status(200).json({ data: parents });
  } catch (error) {
    return next(new HttpError("خطا سمت سرور .", 500));
  }
};
exports.getSubParents = async (req, res, next) => {
  const { categoryId } = req.body;
  try {
    const parents = await Category.findAll({
      where: {
        // parentId: { [Op.ne]: null },
        parentId: categoryId,
      },
      order: [["parentId", "ASC"]],
    });

    if (!parents) {
      return next(new HttpError("دسته بندی مورد نظر یافت نشد. ", 404));
    }
    return res.status(200).json({ data: parents });
  } catch (error) {
    return next(new HttpError("خطا سمت سرور .", 500));
  }
};

exports.getById = async (req, res, next) => {
  try {
    const categoryId = +req.params.categoryId;

    const category = await Category.findByPk(categoryId);

    if (!category) {
      return next(new HttpError("دسته بندی مورد نظر یافت نشد. ", 404));
    }

    return res.status(200).json({ data: category });
  } catch (error) {
    return next(new HttpError("خطا سمت سرور .", 500));
  }
};

exports.add = async (req, res, next) => {
  try {
    const { name } = req.body;
    const file = req?.file;
    let resizedImagePath;

    console.log("reeeeeeqq", req.body);
    console.log("reeeeeeqq file", req.file?.path);
    let createdCategory;

    if (file) {
      resizedImagePath = await resizeImage(file);
    }
    try {
      createdCategory = await Category.create({
        name,
        parentId: null,
        image: resizedImagePath || null,
      });
    } catch (err) {
      console.log("eeeeeee", err);

      if (err.name === "SequelizeUniqueConstraintError") {
        return next(new HttpError("نام دسته بندی تکراری می باشد .", 403));
      }

      return next(new HttpError("خطای سمت سرور ، لطفا مجددا تلاش کنید.", 500));
    }

    return res.status(201).json({ data: createdCategory?.id });
  } catch (error) {
    console.log("eeeee", error);

    return next(new HttpError("خطای سمت سرور ، لطفا مجددا تلاش کنید.", 500));
  }
};

exports.update = async (req, res, next) => {
  let category;

  const categoryId = req.params.categoryId;
  const { name } = req.body;

  try {
    category = await Category.findByPk(categoryId);
  } catch (err) {
    return next(new HttpError("دسته بندی مورد نظر یافت نشد. ", 404));
  }

  try {
    category.name = name;
    await category.save();
    return res.status(200).json({ data: category?.id });
  } catch (err) {
    if (err.name === "SequelizeUniqueConstraintError") {
      return next(new HttpError("نام دسته بندی تکراری می باشد .", 403));
    }
    return new HttpError(
      "خطای بروز رسانی دسته بندی ، لطفا بعدا تلاش کنید .",
      500
    );
  }
};

exports.getSubCategory = async (req, res, next) => {
  try {
    const categoryId = +req.params.categoryId;

    const subCategories = await Category.findAll({
      where: { parentId: categoryId },
    });

    if (!subCategories) {
      return next(new HttpError("دسته بندی های مورد نظر یافت نشد. ", 404));
    }

    return res.status(200).json({ subCategories: subCategories });
  } catch (error) {
    return next(new HttpError("خطا سمت سرور .", 500));
  }
};

exports.getSubCategories = async (req, res, next) => {
  try {
    const page = +req.body.page;
    const pageSize = +req.body.pageSize;
    let offset = (page - 1) * pageSize;
    let limit = pageSize;

    const categoryId = +req.params.categoryId;

    const products = await Category.findAll({
      where: { parentId: categoryId },

      include: [
        {
          model: Product,
          where: {
            count: { [Op.gte]: 1 },
          },
          as: "products",
          limit,
          offset,
          include: [{ model: ProductImage }],
        },
      ],
    });

    const _productsLength = await Category.findAll({
      where: { parentId: categoryId },

      include: [
        {
          model: Product,
          as: "products",
          where: {
            count: { [Op.gte]: 1 },
          },
          include: [{ model: ProductImage }],
        },
      ],
    });

    _count = [];
    _productsLength?.map((item) => {
      _count.push(item.products.length);
    });

    if (!products) {
      return next(
        new HttpError("محصولی برای دسته بندی مورد نظر یافت نشد .", 404)
      );
    }

    return res.status(200).json({ products: products, count: _count });
  } catch (error) {
    return next(new HttpError("خطا سمت سرور .", 500));
  }
};

exports.addSubCategory = async (req, res, next) => {
  try {
    const { name, parent } = req.body;
    const file = req?.file;
    let resizedImagePath;

    if (file) {
      resizedImagePath = await resizeImage(file);
    }

    // const parentId = !parent || parent === "null" ? null : +parent;
    try {
      await Category.create({
        name,
        parentId: +parent,
        image: resizedImagePath || null,
      });
    } catch (err) {
      if (err.name === "SequelizeUniqueConstraintError") {
        return next(new HttpError("نام دسته بندی تکراری می باشد .", 403));
      }
      return next(new HttpError("خطای سمت سرور ، لطفا مجددا تلاش کنید.", 500));
    }

    if (file) {
      removeFile(file.path);
    }

    res.status(201).json({ message: "دسته بندی جدید ایجاد شد" });
  } catch (error) {
    console.error("Error:", error);
    return next(new HttpError("خطای سمت سرور ، لطفا مجددا تلاش کنید.", 500));
  }
};

exports.updateSubCategory = async (req, res, next) => {
  const { name, categoryId, parent } = req.body;

  console.log("reQQQQQQQQ", req.body);

  const file = req?.file;
  let resizedImagePath;

  try {
    if (file) {
      resizedImagePath = await resizeImage(file);
    }

    const category = await Category.findByPk(categoryId);
    if (!category) {
      return next(new HttpError("دسته بندی مورد نظر یافت نشد.", 404));
    }

    let filePath = path.join(
      __dirname,
      "..",
      "uploads",
      "product",
      category?.image?.split(/[\/\\]/).pop()
    );

    if (file) {
      category?.image && removeFile(filePath);
    }

    category.name = name;
    // category.parentId = parent !== "null" ? +parent : null;
    if (file) category.image = resizedImagePath;

    await category.save();

    if (file) {
      removeFile(file.path);
    }

    res.status(200).json({ message: "به روز رسانی دسته بندی انجام شد" });
  } catch (err) {
    if (err.name === "SequelizeUniqueConstraintError") {
      return next(new HttpError("نام دسته بندی تکراری می باشد .", 403));
    }
    return next(
      new HttpError("خطای بروز رسانی دسته بندی ، لطفا بعدا تلاش کنید.", 500)
    );
  }
};

const resizeImage = async (file) => {
  const image = sharp(file.path);
  const metadata = await image.metadata();

  const { width: originalWidth, height: originalHeight } = metadata;
  const targetWidth = 400;
  const targetHeight = 200;

  const aspectRatio = originalWidth / originalHeight;
  const targetAspectRatio = targetWidth / targetHeight;

  let resizeWidth, resizeHeight;

  if (targetAspectRatio > aspectRatio) {
    resizeHeight = targetHeight;
    resizeWidth = Math.ceil(resizeHeight * aspectRatio);
  } else {
    resizeWidth = targetWidth;
    resizeHeight = Math.ceil(resizeWidth / aspectRatio);
  }

  // const resizedImagePath = `uploads/resized-${file.filename}`;

  const resizedImagePath = path.join(
    __dirname,
    "..",
    "uploads",
    "product",
    `resized-${file.filename}`
  );
  await image.resize(resizeWidth, resizeHeight).toFile(resizedImagePath);

  return resizedImagePath;
};

const removeFile = (filePath) => {
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error("Error deleting file:", err);
    } else {
      console.log("File removed:", filePath);
    }
  });
};
