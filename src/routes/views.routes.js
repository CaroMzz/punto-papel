const express = require("express");
const productDao = require("../dao/mongo/ProductDao");
const cartDao = require("../dao/mongo/CartDao");

const router = express.Router();

router.get("/products", async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 10;
    const page = Number(req.query.page) || 1;
    const query = req.query.query;
    const sort = req.query.sort;

    const result = await productDao.getProducts({ limit, page, query, sort });
    const products = JSON.parse(JSON.stringify(result.payload));

    res.render("products", {
      title: "Punto Papel - Productos",
      products,
      pagination: result,
    });
  } catch (error) {
    res.status(500).send("Error al cargar productos");
  }
});

router.get("/products/:pid", async (req, res) => {
  try {
    const product = await productDao.getProductById(req.params.pid);

    if (!product) {
      return res.status(404).send("Producto no encontrado");
    }

    res.render("productDetail", {
      title: product.title,
      product: JSON.parse(JSON.stringify(product)),
    });
  } catch (error) {
    res.status(500).send("Error al cargar el producto");
  }
});

router.get("/carts/:cid", async (req, res) => {
  try {
    const cart = await cartDao.getCartById(req.params.cid);

    if (!cart) {
      return res.status(404).send("Carrito no encontrado");
    }

    res.render("cart", {
      title: "Carrito",
      cart: JSON.parse(JSON.stringify(cart)),
    });
  } catch (error) {
    res.status(500).send("Error al cargar el carrito");
  }
});

module.exports = router;
