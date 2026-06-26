const express = require("express");
const router = express.Router();
const carts = [];

// Crear un nuevo carrito
router.post("/", (req, res) => {
  let newId;
  if (carts.length > 0) {
    const lastCart = carts[carts.length - 1];
    newId = lastCart.id + 1;
  } else {
    newId = 1;
  }

  const listProducts = [];

  const newCart = {
    id: newId,
    products: listProducts,
  };

  carts.push(newCart);

  res.status(201).json(newCart);
});

// Mostrar carrito según id
router.get("/:cid", (req, res) => {
  const cid = Number(req.params.cid);
  const searchedCart = carts.find((cart) => cart.id === cid);

  if (!searchedCart) {
    return res.status(404).json({ error: "Carrito no encontrado" });
  }

  res.json(searchedCart);
});

// Actualizar un carrito
router.put("/:cid", (req, res) => {
  const cid = Number(req.params.cid);
  const searchedCart = carts.find((cart) => cart.id === cid);

  if (!searchedCart) {
    return res.status(404).json({ error: "Carrito no encontrado" });
  }

  const products = req.body.products;

  if (!Array.isArray(products)) {
    return res
      .status(400)
      .json({ error: "Debe enviar una lista de productos" });
  }

  const validProducts = products.every(item => item.product && item.quantity > 0)

  if(!validProducts){
    return res.status(400).json({error: "Ingreso invalido"})
  }

  searchedCart.products = products;

  res.json(searchedCart);
});

// Agregar producto a un carrito
router.post("/:cid/products/:pid", (req, res) => {
  const cid = Number(req.params.cid);
  const pid = Number(req.params.pid);
  const searchedCart = carts.find((cart) => cart.id === cid);

  if (!searchedCart) {
    return res.status(404).json({ error: "Carrito no encontrado" });
  }

  const searchedProduct = searchedCart.products.find(
    (item) => item.product === pid,
  );

  if (searchedProduct) {
    searchedProduct.quantity = searchedProduct.quantity + 1;
  } else {
    searchedCart.products.push({ product: pid, quantity: 1 });
  }

  res.json(searchedCart);
});

// Vaciar un carrito
router.delete("/:cid", (req, res) => {
  const cid = Number(req.params.cid)
  const searchedCart = carts.find((cart) => cart.id === cid)

  if(!searchedCart){
    return res.status(404).json({error: "Carrito no encontrado"})
  }

   searchedCart.products = []

   res.json(searchedCart)
})


// Eliminar un producto del carrito
router.delete("/:cid/products/:pid", (req, res) => {
  const cid = Number(req.params.cid);
  const pid = Number(req.params.pid);
  const searchedCart = carts.find((cart) => cart.id === cid);

  if (!searchedCart) {
    return res.status(404).json({ error: "Carrito no encontrado" });
  }

  const searchedIndexProduct = searchedCart.products.findIndex(
    (item) => item.product === pid,
  );

  if (searchedIndexProduct === -1) {
    return res
      .status(404)
      .json({ error: "Producto no encontrado en el carrito" });
  }

  searchedCart.products.splice(searchedIndexProduct, 1);

  res.json(searchedCart);
});

// Actualizar la cantidad de un producto en un carrito
router.put("/:cid/products/:pid", (req, res) => {
  const cid = Number(req.params.cid);
  const pid = Number(req.params.pid);
  const searchedCart = carts.find((cart) => cart.id === cid);

  if (!searchedCart) {
    return res.status(404).json({ error: "Carrito no encontrado" });
  }

  const searchedProduct = searchedCart.products.find(
    (item) => item.product === pid,
  );

  if (!searchedProduct) {
    return res
      .status(404)
      .json({ error: "Producto no encontrado en el carrito" });
  }

  const quantity = Number(req.body.quantity);

  if (!quantity || quantity <= 0) {
    return res
      .status(400)
      .json({ error: "La cantidad no puede ser 0 ni menos" });
  }

  searchedProduct.quantity = quantity;
  res.json(searchedCart);
});
module.exports = router;
