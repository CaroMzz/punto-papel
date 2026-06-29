const express = require("express");
const router = express.Router();
const {createCart, getCartById, addProductToCart, deleteProductFromCart, updateProductQuantity, updateCart, clearCart} = require("../controllers/carts.controller")

router.post("/", createCart) 

router.get("/:cid", getCartById)

router.post("/:cid/products/:pid", addProductToCart) 

router.delete("/:cid/products/:pid", deleteProductFromCart) 

router.put("/:cid/products/:pid", updateProductQuantity) 

router.put("/:cid",updateCart)

router.delete("/:cid", clearCart)



module.exports = router;
