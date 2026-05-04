const sequelize = require("../db");
const HttpError = require("../models/http-error");
const Product = require("../models/product");
const Category = require("../models/category");
const ProductImage = require("../models/product-image");
const ProductComment = require("../models/product-comment");

const sharp = require("sharp");

const { Op } = require("sequelize");
const fs = require("fs");
const path = require("path");
const FavoriteProduct = require("../models/favorite-products");
const ProductSpecification = require("../models/product-specification");
const ProductVariable = require("../models/product-variable");
const ProductVariableItem = require("../models/product-variable-items");

setInterval(deleteOldFiles, 24 * 60 * 60 * 1000);
// setInterval(deleteOldFiles, 5000);

async function deleteOldFiles() {
  try {
    const FolderPath = path.join(__dirname, "..", "uploads", "product");

    const products = await Product.findAll();
    const productImages = await ProductImage.findAll();
    const categories = await Category.findAll();

    const validFiles = new Set([
      ...products
        .map((product) =>
          product.mainImage ? path.basename(product.mainImage) : null
        )
        .filter(Boolean),
      ...productImages
        .map((img) => (img.secondImage ? path.basename(img.secondImage) : null))
        .filter(Boolean),
      ...productImages
        .map((img) => (img.thirdImage ? path.basename(img.thirdImage) : null))
        .filter(Boolean),
      ...productImages
        .map((img) => (img.fourthImage ? path.basename(img.fourthImage) : null))
        .filter(Boolean),
      ...categories
        .map((cat) => (cat.image ? path.basename(cat.image) : null))
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

exports.confirmComment = async (req, res, next) => {
  const { id } = req.body;
  let _foundComment;
  _foundComment = await ProductComment.findByPk(id);

  if (!_foundComment) {
    return next(new HttpError("record not found", 404));
  }

  try {
    _foundComment.confirmedByAdmin = 1;

    await _foundComment.save();
  } catch (error) {
    return next(new HttpError("An error occured , please try again", 500));
  }

  return res.status(201).json({ msg: "The exchange was updated successfully" });
};
exports.refuseComment = async (req, res, next) => {
  const { id } = req.body;
  let _foundComment;

  _foundComment = await ProductComment.findByPk(id);

  if (!_foundComment) {
    return next(new HttpError("Exchange not found", 404));
  }

  try {
    await _foundComment.destroy();
  } catch (error) {
    return next(new HttpError("An error occured , please try again", 500));
  }

  return res.status(200).json({ msg: "The exchange was updated successfully" });
};
exports.confirmComments = async (req, res, next) => {
  const { comments } = req.body;

  let _foundComment;

  for (const comment of comments) {
    _foundComment = await ProductComment.findByPk(comment.id);

    if (!_foundComment) {
      return next(new HttpError("Exchange not found", 404));
    }

    try {
      _foundComment.confirmedByAdmin = 1;

      await _foundComment.save();
    } catch (error) {
      return next(new HttpError("An error occured , please try again", 500));
    }
  }

  return res.status(201).json({ msg: "The exchange was updated successfully" });
};
exports.refuseComments = async (req, res, next) => {
  const { comments } = req.body;

  let _foundComment;

  for (const comment of comments) {
    _foundComment = await ProductComment.findByPk(comment.id);

    if (!_foundComment) {
      return next(new HttpError("Exchange not found", 404));
    }

    try {
      await _foundComment.destroy();
    } catch (error) {
      return next(new HttpError("An error occured , please try again", 500));
    }
  }
  return res.status(200).json({ msg: "The exchange was updated successfully" });
};
exports.getComments = async (req, res, next) => {
  try {
    const comments = await ProductComment.findAll({
      where: {
        confirmedByAdmin: 0,
      },
      order: [["createdAt", "DESC"]],
    });

    const _unconfirmedByAdmin = await ProductComment.count({
      where: {
        confirmedByAdmin: 0,
      },
    });
    return res
      .status(200)
      .json({ data: comments, unconfirmedByAdmin: _unconfirmedByAdmin });
  } catch (error) {
    return next(new HttpError("خطای سمت سرور ، لطفا مجددا تلاش کنید.", 500));
  }
};
exports.getFavProduct = async (req, res, next) => {
  const { productId } = req.body;

  try {
    const _fav = await FavoriteProduct.findOne({
      where: {
        ClientId: req.userId,
        ProductId: productId,
      },
    });

    return res.status(200).json({ data: _fav ? true : false });
  } catch (error) {
    return next(new HttpError("خطای سمت سرور ، لطفا مجددا تلاش کنید.", 500));
  }
};
exports.addToFavorite = async (req, res, next) => {
  const { productId } = req.body;

  try {
    const [favorite, created] = await FavoriteProduct.findOrCreate({
      where: { ClientId: req.userId, ProductId: productId },
    });

    if (!created) {
      await favorite.destroy({});
      return res.status(201).json({ id: favorite?.id });
    }

    return res.status(201).json({ data: created });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.productsPerCategorySite = async (req, res, next) => {
  let _products;

  try {
    const { categoryId } = req.body;

    console.log("iii", categoryId);

    const cats = await Category.findAll({
      where: {
        parentId: categoryId,
      },

      include: [
        {
          model: Product,
          as: "products",
          include: [
            {
              model: ProductComment,
              attributes: ["rating"],
              where: {
                confirmedByAdmin: true,
              },
              required: false,
            },
          ],
        },
      ],
    });

    // const arrayOfIds = cats.map((item) => item.id);

    // _products = await Product.findAll({
    //   limit: 8,
    //   where: {
    //     categoryId: {
    //       [Op.in]: arrayOfIds,
    //     },
    //     count: { [Op.gte]: 1 },
    //   },

    //   include: [{ model: ProductImage, required: false }],
    // });

    // console.log("pppppp", _products);

    return res.status(200).json({
      data: cats,
    });
  } catch (error) {
    console.log("err", error);

    return next(new HttpError("خطای سمت سرور ، لطفا مجددا تلاش کنید.", 500));
  }
};
exports.productsPerCategory = async (req, res, next) => {
  let _products;

  try {
    const { categoryId, page, pageSize } = req.body;

    const cats = await Category.findAll({
      attributes: ["id"],
      where: {
        parentId: categoryId,
      },
      raw: true,
    });

    const arrayOfIds = cats.map((item) => item.id);

    let offset = (page - 1) * pageSize;
    let limit = pageSize;
    _products = await Product.findAndCountAll({
      distinct: true,
      where: {
        categoryId: {
          [Op.in]: arrayOfIds,
        },
        count: { [Op.gte]: 1 },
      },
      limit,
      offset,
      include: [{ model: ProductImage, required: false }],
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({
      products: _products,
    });
  } catch (error) {
    console.log("err", error);

    return next(new HttpError("خطای سمت سرور ، لطفا مجددا تلاش کنید.", 500));
  }
};
exports.ProductsPerSubCategory = async (req, res, next) => {
  let _products;

  try {
    const { categoryId, page, pageSize } = req.body;

    const _cat = await Category.findByPk(categoryId, {
      include: [
        {
          model: Category,
          as: "parent",
        },
      ],
    });

    let offset = (page - 1) * pageSize;
    let limit = pageSize;
    _products = await Product.findAndCountAll({
      distinct: true,
      where: {
        categoryId: categoryId,
        count: { [Op.gte]: 1 },
      },
      limit,
      offset,

      include: [{ model: ProductImage, required: false }],
    });

    return res.status(200).json({
      products: _products,
      category: _cat?.parent?.name,
      subCategory: _cat?.name,
    });
  } catch (error) {
    console.log("err", error);

    return next(new HttpError("خطای سمت سرور ، لطفا مجددا تلاش کنید.", 500));
  }
};
exports.ProductsPerSubCategorySite = async (req, res, next) => {
  let _products;

  try {
    const { categoryId } = req.body;

    const _cat = await Category.findByPk(categoryId, {
      include: [
        {
          model: Category,
          as: "parent",
        },
      ],
    });

    _products = await Product.findAll({
      where: {
        categoryId: categoryId,
        count: { [Op.gte]: 1 },
      },
      limit: 8,
      include: [{ model: ProductImage, required: false }],
    });

    return res.status(200).json({
      data: _products,
      category: _cat?.parent?.name,
      subCategory: _cat?.name,
    });
  } catch (error) {
    return next(new HttpError("خطای سمت سرور ، لطفا مجددا تلاش کنید.", 500));
  }
};
exports.search = async (req, res, next) => {
  const { searchItem } = req.body;

  const { page, pageSize } = req.body;
  let offset, limit;

  offset = (page - 1) * pageSize;
  limit = pageSize;

  try {
    const _products = await Product.findAndCountAll({
      limit,
      offset,
      where: {
        count: { [Op.gte]: 1 },
        [Op.or]: [{ mainTitle: { [Op.like]: `%${searchItem}%` } }],
      },

      include: [
        {
          model: ProductComment,
          attributes: ["rating"],
          where: {
            confirmedByAdmin: true,
          },
          required: false,
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({ data: _products });
  } catch (error) {
    console.log("eeee", error);

    return next(new HttpError("خطای سمت سرور ، لطفا مجددا تلاش کنید.", 500));
  }
};
exports.updateProductPrices = async (req, res, next) => {
  const _ids = req.params.ids.split(",").map(Number);

  const _products = await Product.findAll({
    attributes: ["id", "price", "discount"],
    where: {
      id: {
        [Op.in]: _ids,
      },
      count: { [Op.gte]: 1 },
    },
  });

  return res.status(200).json({ data: _products });
};
exports.relatedProducts = async (req, res, next) => {
  const { categoryId, productId } = req.params;
  let _products;
  try {
    _products = await Product.findAll({
      limit: 3,
      where: {
        categoryId,
        id: {
          [Op.ne]: productId,
        },
        count: { [Op.gte]: 1 },
      },

      include: [{ model: ProductImage, required: false }],
    });

    if (!_products.length) {
      _products = await Product.findAll({
        limit: 3,
        where: {
          id: { [Op.ne]: productId },
          count: { [Op.gte]: 1 },
        },
        include: [{ model: ProductImage, required: false }],
      });
    }
    return res.status(200).json({ data: _products });
  } catch (error) {
    return next(new HttpError("خطای سمت سرور ، لطفا مجددا تلاش کنید.", 500));
  }
};
exports.insertComment = async (req, res, next) => {
  const { productId, name, mail, text, rating } = req.body;

  try {
    await ProductComment.create({
      name,
      text,
      mail,
      ProductId: productId,
      confirmedByAdmin: false,
      rating,
    });
  } catch (error) {
    return next(new HttpError("خطای سمت سرور ، لطفا مجددا تلاش کنید.", 500));
  }
  return res.status(201).send();
};

exports.sortFavorites = async (req, res, next) => {
  try {
    const page = +req.body.page;
    const pageSize = +req.body.pageSize;
    let offset = (page - 1) * pageSize;
    let limit = pageSize;

    const { selectedSort, type } = req.body;

    //selectedSort === 1 ==> the newest
    //selectedSort === 2 ==> the oldest

    let whereCondition;

    if (type === "Cat") {
      const cats = await Category.findAll({
        attributes: ["id"],
        raw: true,
      });

      const arrayOfIds = cats.map((item) => item.id);
      whereCondition = {
        count: { [Op.gte]: 1 },
        // categoryId: { [Op.in]: arrayOfIds },
      };
    } else {
      whereCondition = {
        // categoryId,
        // count: { [Op.gte]: 1 },
        ClientId: req.userId,
      };
    }

    let _order;
    switch (selectedSort) {
      case 1:
        _order = [["createdAt", "DESC"]];
        break;
      case 2:
        _order = [["createdAt", "ASC"]];
        break;
    }

    const products = await FavoriteProduct.findAndCountAll({
      limit,
      offset,
      // where: {
      //   categoryId: categoryId,
      // },
      where: whereCondition,
      include: [
        {
          model: Product,
          attributes: ["mainImage", "mainTitle", "identifier", "price"],
        },
      ],
      order: _order,
    });

    // products.sort((a, b) => {
    //   return b.price - a.price;
    // });

    if (!products) {
      return next(new HttpError("محصولی یافت نشد .", 404));
    }

    return res.status(200).json({ data: products });
  } catch (error) {
    console.log(error);

    return next(new HttpError("خطای سمت سرور ، لطفا مجددا تلاش کنید.", 500));
  }
};
exports.sort = async (req, res, next) => {
  try {
    // const page = +req.body.page;
    // const pageSize = +req.body.pageSize;
    // let offset = (page - 1) * pageSize;
    // let limit = pageSize;

    const { categoryId, selectedSort, type } = req.body;

    //selectedSort === 1 ==> the newest
    //selectedSort === 2 ==> the best selling
    //selectedSort === 3 ==> all products

    let whereCondition;

    if (type === "Cat") {
      const cats = await Category.findAll({
        attributes: ["id"],
        where: { parentId: categoryId },
        raw: true,
      });

      const arrayOfIds = cats.map((item) => item.id);
      whereCondition = {
        count: { [Op.gte]: 1 },
        categoryId: { [Op.in]: arrayOfIds },
      };
    } else {
      whereCondition = { categoryId, count: { [Op.gte]: 1 } };
    }

    let _order;
    switch (selectedSort) {
      case 1:
        _order = [["createdAt", "DESC"]];
        break;
      case 2:
        _order = [["bestSelling", "DESC"]];
        break;
      case 3:
        _order = [["createdAt", "DESC"]];
        break;
    }

    const products = await Product.findAll({
      // limit,
      // offset,
      // where: {
      //   categoryId: categoryId,
      // },
      where: whereCondition,
      include: [{ model: ProductImage }],
      order: _order,
    });

    // products.sort((a, b) => {
    //   return b.price - a.price;
    // });
    if (!products) {
      return next(new HttpError("محصولی یافت نشد .", 404));
    }

    return res.status(200).json({ data: products });
  } catch (error) {
    console.log(error);

    return next(new HttpError("خطای سمت سرور ، لطفا مجددا تلاش کنید.", 500));
  }
};
exports.allProductWithSameCategory = async (req, res, next) => {
  const page = +req.body.page;
  const pageSize = +req.body.pageSize;
  let offset = (page - 1) * pageSize;
  let limit = pageSize;

  try {
    const productId = +req.params.categoryId;

    const _products = await Product.findAll({
      limit,
      offset,
      where: {
        categoryId: productId,
        count: { [Op.gte]: 1 },
      },

      include: [{ model: ProductImage }],
    });

    const _numberOfProducts = await Product.count({
      where: {
        categoryId: productId,
        count: { [Op.gte]: 1 },
      },
    });

    if (!_products) {
      return next(new HttpError("محصولی یافت نشد .", 404));
    }

    const catId = await Category.findByPk(_products[0].categoryId);

    return res.status(200).json({
      fetchData: _products,
      count: _numberOfProducts,
      catId: catId?.parentId,
    });
  } catch (error) {
    return next(new HttpError("خطای سمت سرور ، لطفا مجددا تلاش کنید.", 500));
  }
};

exports.latestProducts = async (req, res, next) => {
  try {
    const products = await Product.findAll({
      where: {
        count: { [Op.gte]: 1 },
      },
      limit: 3,

      order: [["createdAt", "DESC"]],
      include: [{ model: ProductImage }],
    });

    if (!products) {
      return next(new HttpError("محصولی یافت نشد .", 404));
    }

    return res.status(200).json({ data: products });
  } catch (error) {
    return next(new HttpError("خطای سمت سرور ، لطفا مجددا تلاش کنید.", 500));
  }
};
exports.bestSellingProducts = async (req, res, next) => {
  try {
    const products = await Product.findAll({
      where: {
        count: { [Op.gte]: 1 },
      },
      limit: 3,

      order: [["bestSelling", "DESC"]],

      include: [{ model: ProductImage }],
    });

    if (!products) {
      return next(new HttpError("محصولی یافت نشد .", 404));
    }

    return res.status(200).json({ data: products });
  } catch (error) {
    return next(new HttpError("خطای سمت سرور ، لطفا مجددا تلاش کنید.", 500));
  }
};

exports.getAll = async (req, res, next) => {
  try {
    const limit = parseInt(req.body.limit);
    const offset = parseInt(req.body.offset);

    const products = await Product.findAll({
      where: {
        count: { [Op.gte]: 1 },
      },
      limit,
      offset,
      order: [["createdAt", "DESC"]],
      // include: [{ model: ProductImage }],
      include: [
        {
          model: ProductComment,
          attributes: ["rating"],
          where: {
            confirmedByAdmin: true,
          },
          required: false,
        },

        {
          model: ProductSpecification,
          required: false,
        },
        {
          model: ProductVariable,
          required: false,
          include: [{ model: ProductVariableItem }],
        },
      ],
      distinct: true,
    });

    if (products?.length === 0) {
      return next(new HttpError("محصولی یافت نشد .", 404));
    }

    return res.status(200).json({ data: products });
  } catch (error) {
    return next(new HttpError("خطای سمت سرور ، لطفا مجددا تلاش کنید.", 500));
  }
};
exports.deleteFavorites = async (req, res, next) => {
  try {
    const { productId } = req.body;

    const product = await FavoriteProduct.findOne({
      where: {
        ClientId: +req.userId,
        id: +productId,
      },
    });

    if (!product) {
      console.log("Product not found in favorites.");
      return next(new HttpError("محصولی یافت نشد .", 404));
    }

    await product.destroy();

    return res.status(200).json({ data: "deleteee" });
  } catch (error) {
    console.log("eeee", error);

    return next(new HttpError("خطای سمت سرور ، لطفا مجددا تلاش کنید.", 500));
  }
};

exports.getFavorites = async (req, res, next) => {
  try {
    const { page, pageSize } = req.body;
    let offset, limit;

    offset = (page - 1) * pageSize;
    limit = pageSize;

    const products = await FavoriteProduct.findAndCountAll({
      where: {
        ClientId: req.userId,
      },
      limit,
      offset,
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: Product,
          attributes: ["mainImage", "mainTitle", "identifier", "price"],
        },
      ],
    });

    if (!products) {
      return next(new HttpError("محصولی یافت نشد .", 404));
    }

    return res.status(200).json({ data: products });
  } catch (error) {
    console.log("eeee", error);

    return next(new HttpError("خطای سمت سرور ، لطفا مجددا تلاش کنید.", 500));
  }
};

exports.getById = async (req, res, next) => {
  let product;
  try {
    const productId = req.params.productId;

    product = await Product.findByPk(productId, {
      include: [
        {
          model: ProductImage,
        },
        {
          model: ProductComment,
          where: {
            confirmedByAdmin: true,
          },
          required: false,
        },
        {
          model: ProductSpecification,
          required: false,
        },
        {
          model: ProductVariable,
          required: false,
          include: [{ model: ProductVariableItem }],
        },
      ],
    });

    if (!product) {
      return next(new HttpError("محصولی یافت نشد .", 404));
    }
  } catch (error) {
    console.log("eeee", error);

    return next(new HttpError("خطای سمت سرور ، لطفا مجددا تلاش کنید.", 500));
  }
  return res.status(200).json({ data: product });
};

exports.deleteImage = async (req, res, next) => {
  const { id, imageField } = req.body;

  const transaction = await sequelize.transaction();

  try {
    const productImage = await ProductImage.findOne(
      { where: { ProductId: id } },
      { transaction }
    );

    if (productImage) {
      const imagePath = productImage[imageField];
      if (imagePath) {
        try {
          // await fs.unlink(imagePath);
          console.log(`File removed: ${imagePath}`);

          fs.unlink(imagePath, (err) => {
            if (err) {
              console.error("err delete file", err);
            } else {
              console.log("File removed:::", imagePath);
            }
          });
        } catch (err) {
          console.error(`Error deleting file: ${imagePath}`, err);
        }
      }
    }

    await ProductImage.update(
      { [imageField]: null },
      { where: { ProductId: id }, transaction }
    );

    await transaction.commit();
    return res.status(200).json({ message: "The product has been deleted." });
  } catch (error) {
    console.error("Error:", error);
    await transaction.rollback();
    return next(new HttpError("خطای سمت سرور ، لطفا مجددا تلاش کنید.", 500));
  }
};

exports.delete = async (req, res, next) => {
  var productId = +req.params.productId;

  const deletedProduct = await Product.findByPk(productId);
  const _session = await sequelize.transaction();

  try {
    await ProductImage.destroy(
      {
        where: {
          ProductId: productId,
        },
      },
      { transaction: _session }
    );
    await ProductComment.destroy(
      {
        where: {
          ProductId: productId,
        },
      },
      { transaction: _session }
    );
    const _var = await ProductVariable.destroy(
      {
        where: {
          ProductId: productId,
        },
      },
      { transaction: _session }
    );

    await ProductVariableItem.destroy(
      {
        where: {
          ProductVariableId: _var?.id,
        },
      },
      { transaction: _session }
    );
    await ProductSpecification.destroy(
      {
        where: {
          ProductId: productId,
        },
      },
      { transaction: _session }
    );

    if (!deletedProduct) {
      await _session.commit();
      return next(new HttpError("محصولی یافت نشد .", 404));
    }

    await deletedProduct.destroy({ transaction: _session });

    await _session.commit();
    return res.status(200).json({ message: "The product has been deleted ." });
  } catch (error) {
    await _session.rollback();
    return next(new HttpError("خطای سمت سرور ، لطفا مجددا تلاش کنید.", 500));
  }
};

const resizeImage = async (imagePath, filename, width = 400, height = 200) => {
  const image = sharp(imagePath);
  const metadata = await image.metadata();

  const oratio = metadata.width / metadata.height;
  const mratio = width / height;

  let theight, twidth;
  if (mratio > oratio) {
    theight = height;
    twidth = theight * oratio;
  } else {
    twidth = width;
    theight = twidth / oratio;
  }

  const resizedImagePath = path.join(
    __dirname,
    "..",
    "uploads",
    "product",
    `resized-${filename}`
  );
  await image
    .resize(Math.ceil(twidth), Math.ceil(theight))
    .toFile(resizedImagePath);

  return resizedImagePath;
};

const updateProductImages = async (product, req, session) => {
  const imagesToUpdate = [
    "mainImage",
    "secondImage",
    "thirdImage",
    "fourthImage",
  ];

  for (const field of imagesToUpdate) {
    if (req.files[field]) {
      // Retrieve the current image path
      let oldFilePath;

      const productImageRecord = await ProductImage.findOne({
        where: { ProductId: product.id },
      });

      oldFilePath = productImageRecord?.[field]
        ? path.join(
            __dirname,
            "..",
            "uploads",
            "product",
            productImageRecord[field].split(/[\/\\]/).pop()
          )
        : null;

      // Delete the old file if it exists
      if (oldFilePath) {
        fs.unlink(oldFilePath, (err) => {
          if (err) {
            console.error(`Error deleting file (${field}):`, err);
          } else {
            console.log("File Removed::", oldFilePath);
          }
        });
      }

      // Resize and save the new image
      const resizedImagePath = await resizeImage(
        req.files[field][0].path,
        req.files[field][0].filename
      );

      await ProductImage.update(
        { [field]: resizedImagePath },
        { where: { ProductId: product.id }, transaction: session }
      );

      // Delete the uploaded file after resizing
      fs.unlink(req.files[field][0].path, (err) => {
        if (err) console.error("Error deleting uploaded file:", err);
      });
    }
  }
};

exports.update = async (req, res, next) => {
  const productId = +req.params.productId;
  const {
    mainTitle,
    subTitle,
    price,
    discount,
    count,
    description,
    category,
    identifier,
    specifications,
    variables,
  } = req.body;

  const _session = await sequelize.transaction();

  try {
    const product = await Product.findByPk(productId);

    if (!product) {
      await _session.commit();
      return next(new HttpError("محصولی یافت نشد .", 404));
    }

    const updatedData = {
      mainTitle,
      subTitle,
      discount,
      count,
      description,
      identifier,
      price: +String(price).replace(/,/g, ""),
      categoryId: +category,
    };

    if (req.files["mainImage"]) {
      let oldFilePath = path.join(
        __dirname,
        "..",
        "uploads",
        "product",
        product?.mainImage?.split(/[\/\\]/).pop()
      );

      oldFilePath &&
        fs.unlink(oldFilePath, (err) => {
          if (err) console.error("Error deleting file:", err);
        });

      const resizedMainImage = await resizeImage(
        req.files["mainImage"][0].path,
        req.files["mainImage"][0].filename
      );
      updatedData.mainImage = resizedMainImage;
    }

    await product.update(updatedData, { transaction: _session });
    await updateProductImages(product, req, _session);

    await ProductSpecification.destroy({
      where: { ProductId: product.id },
      transaction: _session,
    });

    for (const { key, value, selected } of specifications) {
      await ProductSpecification.create(
        {
          key,
          value,
          selected,
          ProductId: product.id,
        },
        { transaction: _session }
      );
    }

    // Update Vars
    let existingVariables = await ProductVariable.findAll({
      where: { ProductId: product.id },
      transaction: _session,
    });

    const existingVarIds = existingVariables.map((v) => v.id);

    if (existingVarIds.length) {
      await ProductVariableItem.destroy({
        where: { ProductVariableId: existingVarIds },
        transaction: _session,
      });

      await ProductVariable.destroy({
        where: { id: existingVarIds },
        transaction: _session,
      });
    }

    for (const { key, items = [] } of variables) {
      const createdVar = await ProductVariable.create(
        { variable: key, ProductId: product.id },
        { transaction: _session }
      );

      const varItemsData = items.map((value) => ({
        value,
        ProductVariableId: createdVar.id,
      }));

      await ProductVariableItem.bulkCreate(varItemsData, {
        transaction: _session,
      });
    }

    await _session.commit();
    return res.status(200).json({ message: "به روز رسانی محصول انجام شد" });
  } catch (err) {
    console.error("Error updating product:", err);
    await _session.rollback();
    return next(
      new HttpError("خطای بروز رسانی محصول ، لطفا بعدا تلاش کنید .", 500)
    );
  }
};

exports.add = async (req, res, next) => {
  const {
    mainTitle,
    subTitle,
    price,
    discount,
    count,
    description,
    category,
    identifier,
    specifications,
    variables,
  } = req.body;

  if (!mainTitle || !price || !category || !count) {
    return res.status(400).json({ data: "Invalid request" });
  }

  const extractFilePath = (fieldName) =>
    req.files[fieldName]?.[0]?.path || null;
  const extractFileName = (fieldName) =>
    req.files[fieldName]?.[0]?.filename || null;

  const resizeAndDelete = async (fieldName) => {
    const filePath = extractFilePath(fieldName);
    const fileName = extractFileName(fieldName);
    if (!filePath || !fileName) return null;

    try {
      const resizedPath = await resizeImage(filePath, fileName);
      fs.unlink(filePath, (err) => {
        if (err) console.error(`Error deleting ${fieldName}:`, err);
      });
      return resizedPath;
    } catch (err) {
      console.error(`Error resizing ${fieldName}:`, err);
      return null;
    }
  };

  const _session = await sequelize.transaction();

  try {
    // Resize main image
    const resizedMainImage = await resizeAndDelete("mainImage");

    const createdProduct = await Product.create(
      {
        mainTitle,
        subTitle,
        discount,
        count,
        identifier,
        mainImage: resizedMainImage,
        price: +String(price).replace(/,/g, ""),
        count,
        description,
        categoryId: +category,
      },
      { transaction: _session }
    );

    // Add Specifications
    for (const { key, value, selected } of specifications) {
      await ProductSpecification.create(
        {
          key,
          value,
          selected,
          ProductId: createdProduct.id,
        },
        { transaction: _session }
      );
    }

    // Add Variables and Items
    for (const { key, items = [] } of variables) {
      const createdVar = await ProductVariable.create(
        { variable: key, ProductId: createdProduct.id },
        { transaction: _session }
      );

      const varItemsData = items.map((value) => ({
        value,
        ProductVariableId: createdVar.id,
      }));

      await ProductVariableItem.bulkCreate(varItemsData, {
        transaction: _session,
      });
    }

    // Resize and create secondary images
    const resizedImages = await Promise.all(
      ["secondImage", "thirdImage", "fourthImage"].map(resizeAndDelete)
    );

    await ProductImage.create(
      {
        ProductId: createdProduct.id,
        secondImage: resizedImages[0],
        thirdImage: resizedImages[1],
        fourthImage: resizedImages[2],
      },
      { transaction: _session }
    );

    await _session.commit();
    return res.status(201).json({ message: "محصول جدید ایجاد شد" });
  } catch (err) {
    console.error("Error creating product:", err);
    await _session.rollback();
    return next(new HttpError("خطای سمت سرور ، لطفا مجددا تلاش کنید.", 500));
  }
};
