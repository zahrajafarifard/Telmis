const Product = require("../models/product");
const ProductImage = require("../models/product-image");
const Cart = require("../models/cart");
const CartDetails = require("../models/cart-details");
const HttpError = require("../models/http-error");
const sequelize = require("../db");

const { Op } = require("sequelize");
const Factor = require("../models/factor");
const ClientAddress = require("../models/client-address");
const Client = require("../models/client");
const TimeSlot = require("../models/timeSlot");
const StatusFactor = require("../models/status-factor");
const FactorDetails = require("../models/factor-details");
const DaysOfYear = require("../models/daysOfYear");

exports.getOrders = async (req, res, next) => {
  try {
    const { factorId } = req.params;
    const _clientId = req.userId;
    let _foundCart, _allFactors;

    _foundCart = await Cart.findOne({
      where: {
        ClientId: _clientId,
        FactorId: +factorId,
      },
    });

    if (_foundCart) {
      _allFactors = await Factor.findAll({
        where: {
          ClientId: _clientId,
          id: factorId,
          StatusFactorId: 1,
        },
        include: [
          {
            model: ClientAddress,
          },
          {
            model: Client,
            attributes: ["name", "mobile"],
          },
          {
            model: TimeSlot,
            attributes: ["startTime"],
            include: [{ model: DaysOfYear, attributes: ["slotDuration"] }],
          },
          {
            model: StatusFactor,

            attributes: ["id", "status", "color", "bgColor"],
          },
          {
            model: FactorDetails,
            // include: [
            //   {
            //     model: Product,
            //     attributes: ["mainTitle", "mainImage", "price", "discount"],
            //   },
            // ],
          },
        ],
      });
    }

    return res.status(200).send({ data: _allFactors });
  } catch (error) {
    console.log("eee", error);

    return next(new HttpError("خطای سمت سرور ، لطفا مجددا تلاش کنید.", 500));
  }
};

// exports.getNumberOfProductsInCart = async (req, res, next) => {
//   const _clientId = req.params.clientId;

//   try {
//     let _foundCartDetails = await Cart.findOne({
//       attributes: ["numberOfProductsInCart"],
//       where: {
//         ClientId: _clientId,
//       },
//     });

//     return res
//       .status(200)
//       .json({ count: _foundCartDetails?.dataValues?.numberOfProductsInCart });
//   } catch (error) {
//     return next(new HttpError("خطای سمت سرور ، لطفا مجددا تلاش کنید.", 500));
//   }
// };

// exports.minusQuantity = async (req, res, next) => {
//   try {
//     let _foundCartDetails;
//     const _cartDetailsId = req.params.cartItem;
//     const _session = await sequelize.transaction();

//     _foundCartDetails = await CartDetails.findByPk(_cartDetailsId, {
//       transaction: _session,
//     });

//     if ((await _foundCartDetails.count) >= 1) {
//       _foundCartDetails.count = (await _foundCartDetails.count) - 1;
//       await _foundCartDetails.save({ transaction: _session });
//     }

//     if (_foundCartDetails.count == 0) {
//       await _foundCartDetails.destroy({
//         transaction: _session,
//       });
//     }

//     let _addNumberOfProductsInCart = await Cart.findOne(
//       {
//         where: {
//           ClientId: req.clientId,
//         },
//       },
//       {
//         transaction: _session,
//       }
//     );

//     _addNumberOfProductsInCart.numberOfProductsInCart =
//       (await _addNumberOfProductsInCart.numberOfProductsInCart) - 1;
//     await _addNumberOfProductsInCart.save({
//       transaction: _session,
//     });

//     await _session.commit();
//     return res.status(200).json({
//       count: _foundCartDetails.count,
//       numberOfProductsInCart: _addNumberOfProductsInCart.numberOfProductsInCart,
//     });
//   } catch (error) {
//     await _session.rollback();
//     return next(new HttpError("خطای سمت سرور ، لطفا مجددا تلاش کنید.", 500));
//   }
// };

// exports.addQuantity = async (req, res, next) => {
//   try {
//     let _foundCartDetails;
//     const _cartDetailsId = req.params.cartItem;

//     const _session = await sequelize.transaction();

//     _foundCartDetails = await CartDetails.findByPk(
//       _cartDetailsId,
//       { include: [{ model: Product }] },
//       {
//         transaction: _session,
//       }
//     );

//     if (
//       (await _foundCartDetails.count) < (await _foundCartDetails?.Product.count)
//     ) {
//       _foundCartDetails.count = (await _foundCartDetails.count) + 1;
//       await _foundCartDetails.save({
//         transaction: _session,
//       });
//     } else {
//       return next(new HttpError("خطا در افزودن محصول به سبد", 403));
//     }

//     let _addNumberOfProductsInCart = await Cart.findOne(
//       {
//         where: {
//           ClientId: req.clientId,
//         },
//       },
//       {
//         transaction: _session,
//       }
//     );

//     _addNumberOfProductsInCart.numberOfProductsInCart =
//       (await _addNumberOfProductsInCart.numberOfProductsInCart) + 1;
//     await _addNumberOfProductsInCart.save({
//       transaction: _session,
//     });

//     await _session.commit();
//     return res.status(200).json({
//       count: _foundCartDetails.count,
//       numberOfProductsInCart: _addNumberOfProductsInCart.numberOfProductsInCart,
//     });
//   } catch (error) {
//     await _session.rollback();
//     return next(new HttpError("خطای سمت سرور ، لطفا مجددا تلاش کنید.", 500));
//   }
// };

// exports.deleteProductFromCart = async (req, res, next) => {
//   const _session = await sequelize.transaction();
//   try {
//     let _foundCartDetails;
//     const _cartDetailsId = req.params.cartItem;

//     _foundCartDetails = await CartDetails.findByPk(_cartDetailsId, {
//       transaction: _session,
//     });

//     let _minusNumberOfProductsInCart = await Cart.findOne(
//       {
//         where: {
//           ClientId: req.clientId,
//         },
//       },
//       {
//         transaction: _session,
//       }
//     );

//     _minusNumberOfProductsInCart.numberOfProductsInCart =
//       (await _minusNumberOfProductsInCart.numberOfProductsInCart) -
//       +_foundCartDetails.count;
//     await _minusNumberOfProductsInCart.save({
//       transaction: _session,
//     });

//     let { count } = await CartDetails.findAndCountAll(
//       {
//         where: {
//           CartId: _foundCartDetails.CartId,
//         },
//         include: [{ model: Cart }],
//       },
//       { transaction: _session }
//     );

//     await _foundCartDetails.destroy({
//       transaction: _session,
//     });

//     if (count === 1) {
//       let _emptyCart = await Cart.findByPk(_foundCartDetails.CartId, {
//         transaction: _session,
//       });

//       _emptyCart.status = 0;
//       await _emptyCart.save({ transaction: _session });
//       // await _emptyCart.destroy({ transaction: _session });
//     }

//     await _session.commit();
//     return res.status(200).json({
//       numberOfProductsInCart:
//         _minusNumberOfProductsInCart.numberOfProductsInCart,
//     });
//   } catch (error) {
//     await _session.rollback();
//     return next(new HttpError("خطای سمت سرور ، لطفا مجددا تلاش کنید.", 500));
//   }
// };

// exports.getCart = async (req, res, next) => {
//   try {
//     const _clientId = req.params.clientId;
//     let _foundCart, _foundCartDetails;
//     let total = 0;

//     _foundCart = await Cart.findOne({
//       where: {
//         ClientId: _clientId,
//       },
//     });
//     if (_foundCart) {
//       _foundCartDetails = await CartDetails.findAll({
//         where: {
//           CartId: _foundCart.id,
//         },
//         include: [
//           {
//             model: Product,
//             where: {
//               count: { [Op.gte]: 1 },
//             },
//             include: [{ model: ProductImage }],
//           },
//         ],
//       });

//       _foundCartDetails?.map((item) => {
//         let price = 0;
//         price = Number(item.count) * Number(item.Product.price);
//         total = total + price;
//       });
//     }

//     return res.status(200).send({ _foundCartDetails, total });
//   } catch (error) {
//     return next(new HttpError("خطای سمت سرور ، لطفا مجددا تلاش کنید.", 500));
//   }
// };

// exports.addToCart = async (req, res, next) => {
//   const _session = await sequelize.transaction();
//   const _productId = req.body.productId;

//   let _cartPerClient, _cartDetails;
//   try {
//     [_cartPerClient, created] = await Cart.findOrCreate({
//       where: {
//         ClientId: req.clientId,
//       },
//       defaults: {
//         status: true,
//         numberOfProductsInCart: 1,
//       },
//       transaction: _session,
//     });

//     [_cartDetails, recentlyCreated] = await CartDetails.findOrCreate({
//       where: {
//         CartId: _cartPerClient.id,
//         ProductId: _productId,
//       },
//       include: [{ model: Product }],
//       defaults: {
//         count: 1,
//       },
//       transaction: _session,
//     });

//     if (!recentlyCreated) {
//       if (_cartDetails.count >= _cartDetails?.Product.count) {
//         await _session.commit();
//         return next(
//           new HttpError("شما قادر به اضافه کردن محصول به سبد نیستید", 403)
//         );
//       }
//       _cartDetails.count = +_cartDetails.count + 1;
//       await _cartDetails.save({ transaction: _session });
//     }

//     if (!created) {
//       _cartPerClient.numberOfProductsInCart =
//         (await _cartPerClient.numberOfProductsInCart) + 1;
//       await _cartPerClient.save({ transaction: _session });
//     }

//     res.status(200).json({
//       numberOfProductsInCart: !created
//         ? _cartPerClient.numberOfProductsInCart
//         : 1,
//     });
//     await _session.commit();
//   } catch (error) {
//     await _session.rollback();
//     return next(new HttpError("خطای سمت سرور ، لطفا مجددا تلاش کنید.", 500));
//   }
// };
