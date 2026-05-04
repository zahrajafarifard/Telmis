const Product = require("../models/product");
const ProductImage = require("../models/product-image");
const Factor = require("../models/factor");
const FactorDetails = require("../models/factor-details");
const FactorDetailsMeta = require("../models/factor-details-meta");
const CartDetails = require("../models/cart-details");
const Cart = require("../models/cart");
const Client = require("../models/client");
const ClientAddress = require("../models/client-address");
const StatusFactor = require("../models/status-factor");
const HttpError = require("../models/http-error");
const { Transaction, Sequelize, Op } = require("sequelize");
const io = require("../socket");
const sequelize = require("../db");
const TimeSlot = require("../models/timeSlot");
const DaysOfYear = require("../models/daysOfYear");
const ClientShopNotification = require("../models/client-shop-notification");
const FavoriteProduct = require("../models/favorite-products");

exports.deliveredOrders = async (req, res, next) => {
  let _allFactors;
  try {
    _allFactors = await FactorDetails.findAll({
      include: [
        {
          model: Factor,
          include: [{ model: Client }, { model: StatusFactor }],

          where: {
            StatusFactorId: { [Op.eq]: 3 },
          },
        },
        // {
        //   model: Product,
        // },
      ],
    });
  } catch (error) {
    return next(new HttpError("خطای سمت سرور ، لطفا مجددا تلاش کنید.", 500));
  }

  return res.status(200).json({ factors: _allFactors });
};
exports.changeStatus = async (req, res, next) => {
  let _foundFactor;
  const _factorId = req.params.factorId;
  const _statusFacor = req.body.status;
  const _userId = req.userId;

  if (!_userId) {
    return res.status(400).json({ data: "invalid request" });
  }
  try {
    _foundFactor = await Factor.findByPk(_factorId);
    _foundFactor.StatusFactorId = _statusFacor;
    await _foundFactor.save();

    /////////////////////////////////////////////
    try {
      notification = await ClientShopNotification.create({
        title: "change status",
        message: "factor status was changed",
        ClientId: req.userId,
      });
    } catch (error) {
      console.log("err", error);
    }

    let _notif = await ClientShopNotification.findAll({
      where: { status: "unread" },
      include: [{ model: Client }],
      order: [["createdAt", "DESC"]],
    });

    io.getio().emit("changeStatus", {
      data: _notif,
    });
    /////////////////////////////////////////////
  } catch (error) {
    return next(new HttpError("خطای سمت سرور ، لطفا مجددا تلاش کنید.", 500));
  }

  return res.status(200).json({ msg: "Factor is updated successfully ... " });
};

exports.getStatus = async (req, res, next) => {
  let _status;
  try {
    _status = await StatusFactor.findAll({});
  } catch (error) {
    return next(new HttpError("خطای سمت سرور ، لطفا مجددا تلاش کنید.", 500));
  }

  return res.status(200).json({ data: _status });
};

exports.getFactorForAdmin = async (req, res, next) => {
  let _factor;
  const { factorId } = req.params;

  try {
    _factor = await Factor.findAll({
      where: { id: factorId },
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
          include: [
            { model: DaysOfYear, attributes: ["shippingCost", "slotDuration"] },
          ],
        },
        {
          model: StatusFactor,
          attributes: ["id", "status", "color", "bgColor"],
        },
        {
          model: FactorDetails,
          include: [
            {
              model: FactorDetailsMeta,
            },
          ],
        },
      ],
      // raw: false,
    });
  } catch (error) {
    return next(new HttpError("خطای سمت سرور ، لطفا مجددا تلاش کنید.", 500));
  }

  return res.status(200).json({ data: _factor });
};
exports.getFactor = async (req, res, next) => {
  let _factor;
  const { factorId } = req.params;

  try {
    _factor = await Factor.findAll({
      where: { ClientId: req.userId, id: factorId },
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
          include: [
            { model: DaysOfYear, attributes: ["shippingCost", "slotDuration"] },
          ],
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
      // raw: false,
    });
  } catch (error) {
    return next(new HttpError("خطای سمت سرور ، لطفا مجددا تلاش کنید.", 500));
  }

  return res.status(200).json({ data: _factor });
};
exports.getLatestFactors = async (req, res, next) => {
  let _allFactors;
  try {
    _allFactors = await Factor.findAll({
      limit: 3,
      where: { ClientId: req.userId },
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

      order: [["createdAt", "DESC"]],
    });
  } catch (error) {
    return next(new HttpError("خطای سمت سرور ، لطفا مجددا تلاش کنید.", 500));
  }

  return res.status(200).json({ data: _allFactors });
};
exports.getAllFactors = async (req, res, next) => {
  let _allFactors;

  const { page, pageSize } = req.body;

  offset = (page - 1) * pageSize;
  limit = pageSize;

  try {
    _allFactors = await Factor.findAndCountAll({
      limit,
      distinct: true,
      offset,
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
      order: [["createdAt", "DESC"]],
    });
  } catch (error) {
    console.log("reeeee", error);

    return next(new HttpError("خطای سمت سرور ، لطفا مجددا تلاش کنید.", 500));
  }

  return res.status(200).json({ data: _allFactors });
};
exports.getFactors = async (req, res, next) => {
  let _allFactors;

  const { page, pageSize } = req.body;

  offset = (page - 1) * pageSize;
  limit = pageSize;

  try {
    _allFactors = await Factor.findAndCountAll({
      limit,
      distinct: true,
      offset,
      where: { ClientId: req.userId },
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
      order: [["createdAt", "DESC"]],
    });
  } catch (error) {
    console.log("ffff", error);
    return next(new HttpError("خطای سمت سرور ، لطفا مجددا تلاش کنید.", 500));
  }

  return res.status(200).json({ data: _allFactors });
};
exports.sortFactors = async (req, res, next) => {
  try {
    const page = +req.body.page;
    const pageSize = +req.body.pageSize;
    let offset = (page - 1) * pageSize;
    let limit = pageSize;

    const { selectedSort } = req.body;

    //selectedSort === 1 ==> the newest
    //selectedSort === 2 ==> the oldest

    let whereCondition;

    whereCondition = {
      ClientId: req.userId,
    };

    let _order;
    switch (selectedSort) {
      case 1:
        _order = [["createdAt", "DESC"]];
        break;
      case 2:
        _order = [["createdAt", "ASC"]];
        break;
    }

    const products = await Factor.findAndCountAll({
      limit,
      offset,
      where: { ClientId: req.userId },
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

exports.fetchPreviousPurchases = async (req, res, next) => {
  const _clientId = req.params.clientId;
  let _allFactors;
  try {
    _allFactors = await FactorDetails.findAll({
      include: [
        {
          model: Factor,
          where: {
            ClientId: _clientId,
          },
        },
        // {
        //   model: Product,
        //   include: [{ model: ProductImage }],
        // },
      ],
    });
  } catch (error) {
    return next(new HttpError("خطای سمت سرور ، لطفا مجددا تلاش کنید.", 500));
  }
  return res.status(200).json({ prev: _allFactors });
};

exports.ChangeAddress = async (req, res, next) => {
  const _session = await sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
  });
  const { address, slot, factorId, shippingCost } = req.body;

  try {
    const _updatingFactor = await Factor.findByPk(factorId, {
      include: [
        {
          model: TimeSlot,
          include: [{ model: DaysOfYear, attributes: ["shippingCost"] }],
        },
      ],
      transaction: _session,
      lock: _session.LOCK.UPDATE,
    });
    if (!_updatingFactor) {
      await _session.rollback();
      return next(new HttpError("Factor not found.", 404));
    }

    const _shippingCost = Number(
      _updatingFactor.TimeSlot.DaysOfYear?.shippingCost || 0
    );

    await TimeSlot.increment("remainingPerson", {
      by: 1,
      where: { id: _updatingFactor?.TimeSlotId },
      transaction: _session,
    });

    const [updatedCount] = await TimeSlot.update(
      { remainingPerson: Sequelize.literal("remainingPerson - 1") },
      {
        where: {
          id: slot,
          remainingPerson: { [Sequelize.Op.gt]: 0 },
        },
        transaction: _session,
        lock: _session.LOCK.UPDATE,
      }
    );

    if (updatedCount === 0) {
      await _session.rollback();
      return next(new HttpError("ظرفیت بازه زمانی تکمیل شده است.", 400));
    }

    await Factor.update(
      {
        ClientAddressId: address,
        TimeSlotId: slot,
        price: _updatingFactor?.price - +_shippingCost + shippingCost,
      },
      {
        where: {
          id: factorId,
          ClientId: req.userId,
        },
        transaction: _session,
      }
    );
    await _session.commit();
    return res.status(201).json({ msg: "done.." });
  } catch (error) {
    console.log("eeee", error);
    await _session.rollback();
    return next(new HttpError("خطای سمت سرور ، لطفا مجددا تلاش کنید.", 500));
  }
};

exports.order = async (req, res, next) => {
  const _session = await sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
  });

  const { address, cart, slot } = req.body;

  if (!address || !cart || !slot || req.mobile === "") {
    return res.status(400).json({ msg: "Invalid request" });
  }

  const _trackingCode = Math.floor(100000 + Math.random() * 900000);

  try {
    let _totalPrice = 0;
    let _totalDiscount = 0;
    let _totalFactorCost = 0;
    let _totalFactorDiscount = 0;

    for (const item of cart) {
      const _foundProduct = await Product.findByPk(item?.id);

      if (!_foundProduct) {
        await _session.rollback();
        return res.status(403).json({ msg: "Invalid request" });
      }

      const productPrice = _foundProduct?.price;

      _totalPrice = productPrice * item?.quantity;
      _totalDiscount = _foundProduct?.discount * item?.quantity;

      _totalFactorCost += _totalPrice;
      _totalFactorDiscount += _totalDiscount;
    }

    const _timeSlot = await TimeSlot.findByPk(slot, {
      attributes: ["DaysOfYearId"],
      transaction: _session,
    });

    const _shippingCost = await DaysOfYear.findByPk(_timeSlot?.DaysOfYearId, {
      attributes: ["shippingCost"],
      transaction: _session,
    });

    const _netPrice =
      _totalFactorCost - _totalFactorDiscount + _shippingCost?.shippingCost;

    const createdFactor = await Factor.create(
      {
        date: new Date(),
        ClientId: req.userId,
        StatusFactorId: 1,
        ClientAddressId: address,
        TimeSlotId: slot,
        trackingCode: _trackingCode,
        price: _totalFactorCost,
        discount: _totalFactorDiscount, //new
        netPrice: _netPrice, //new
        shippingCost: _shippingCost?.shippingCost, //new
      },
      { transaction: _session }
    );

    for (const item of cart) {
      console.log("IIIIIItem carttt", item);

      const _foundProduct = await Product.findByPk(item.id);

      const _details = await FactorDetails.create(
        {
          count: item.quantity,
          price: _foundProduct.price,
          FactorId: createdFactor?.id,
          ProductId: _foundProduct.id,
          mainImage: _foundProduct?.mainImage, //
          mainTitle: _foundProduct?.mainTitle, //
          discount: _foundProduct?.discount, //
        },
        { transaction: _session }
      );

      for (const opt of item?.options) {
        await FactorDetailsMeta.create(
          {
            key: opt?.key,
            value: opt?.value,
            FactorDetailId: _details?.id,
          },
          {
            transaction: _session,
          }
        );
      }

      const _updatingProduct = await Product.findByPk(_foundProduct.id, {
        transaction: _session,
        lock: _session.LOCK.UPDATE,
      });

      if (_updatingProduct?.count <= 0) {
        await _session.rollback();
        return next(new HttpError("موجودی محصول کافی نیست.", 409));
      }

      _updatingProduct.count -= item.quantity;
      _updatingProduct.bestSelling += item.quantity;

      await _updatingProduct.save({ transaction: _session });

      if (_updatingProduct.count === 1) {
        let _clientsWhoAddedProductToTheirFavorites =
          await FavoriteProduct.findAll({
            where: {
              ProductId: _updatingProduct.id,
            },
          });

        for (const client of _clientsWhoAddedProductToTheirFavorites) {
          try {
            notification = await ClientShopNotification.create(
              {
                title: "last product",
                message: "only one product is left",
                ClientId: client.ClientId,
              },
              { transaction: _session }
            );
          } catch (error) {
            console.log("err", error);
          }

          let _notif = await ClientShopNotification.findAll({
            where: { status: "unread" },
            include: [{ model: Client }],
            order: [["createdAt", "DESC"]],
            transaction: _session,
          });

          io.getio().emit("latestProduct", {
            data: _notif,
          });
        }
      }
    }

    ////////////////////////////////

    const [updatedCount] = await TimeSlot.update(
      { remainingPerson: Sequelize.literal("remainingPerson - 1") },
      {
        where: {
          id: slot,
          remainingPerson: { [Sequelize.Op.gt]: 0 },
        },
        transaction: _session,
        lock: _session.LOCK.UPDATE,
      }
    );

    if (updatedCount === 0) {
      await _session.rollback();
      return next(new HttpError("ظرفیت بازه زمانی تکمیل شده است.", 408));
    }
    ////////////////////////////////
    try {
      notification = await ClientShopNotification.create(
        {
          title: "order registration",
          message: "order was registered",
          ClientId: req.userId,
        },
        { transaction: _session }
      );
    } catch (error) {
      console.log("err", error);
    }

    let _notif = await ClientShopNotification.findAll({
      where: { status: "unread" },
      include: [{ model: Client }],
      order: [["createdAt", "DESC"]],
      transaction: _session,
    });

    io.getio().emit("orderRegistration", {
      data: _notif,
    });
    ////////////////////////////////

    await _session.commit();
    // await _session.rollback();

    return res.status(201).json({
      factorId: createdFactor?.id,
      trackingCode: createdFactor?.trackingCode,
    });
  } catch (error) {
    console.log("error", error);

    await _session.rollback();
    return next(new HttpError("خطای سمت سرور ، لطفا مجددا تلاش کنید.", 500));
  }
};
