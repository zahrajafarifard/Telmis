const express = require("express");
const router = express.Router();

const cartsControllers = require("../controllers/carts-controllers");
const chechAuth = require("../shared/checkAuth");

router.get("/:factorId", chechAuth, cartsControllers.getOrders);

// // client - side routes
// router.get("/api/cartItems/:clientId", chechAuth, cartsControllers.getCart);
// router.get("/api/numberOfProductsInCart/:clientId", chechAuth, cartsControllers.getNumberOfProductsInCart);
// router.post("/api/addToCart", chechAuth, cartsControllers.addToCart);
// router.patch(
//   "/api/addQuantity/:cartItem",
//   chechAuth,
//   cartsControllers.addQuantity
// );
// router.patch(
//   "/api/minusQuantity/:cartItem",
//   chechAuth,
//   cartsControllers.minusQuantity
// );
// router.delete(
//   "/api/deleteProductFromCart/:cartItem",
//   chechAuth,
//   cartsControllers.deleteProductFromCart
// );

module.exports = router;
