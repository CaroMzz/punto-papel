const carts = require("../data/carts.data");

const createCart = (req, res) => {
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
};

const getCartById = (req, res) => {
  const cid = Number(req.params.cid);
  const searchedCart = carts.find((cart) => cart.id === cid);

  if (!searchedCart) {
    return res.status(404).json({ error: "Carrito no encontrado" });
  }

  res.json(searchedCart);
};

const addProductToCart = (req, res) => {
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
};

const deleteProductFromCart = (req, res) => {
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
};

const updateProductQuantity = (req, res) => {
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
};

const updateCart = (req, res) => {
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

  const validProducts = products.every(
    (item) => item.product && item.quantity > 0,
  );

  if (!validProducts) {
    return res.status(400).json({ error: "Ingreso invalido" });
  }

  searchedCart.products = products;

  res.json(searchedCart);
};

const clearCart = (req, res) => {
  const cid = Number(req.params.cid);
  const searchedCart = carts.find((cart) => cart.id === cid);

  if (!searchedCart) {
    return res.status(404).json({ error: "Carrito no encontrado" });
  }

  searchedCart.products = [];

  res.json(searchedCart);
};

module.exports = {
  createCart,
  getCartById,
  addProductToCart,
  deleteProductFromCart,
  updateProductQuantity,
  updateCart,
  clearCart,
};
