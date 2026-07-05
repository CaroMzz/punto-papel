const cartDao = require("../dao/mongo/CartDao");

const createCart = async (req, res) => {
  try {
    const createdCart = await cartDao.createCart();
    res.status(201).json(createdCart);
  } catch (error) {
    res.status(500).json({ error: "Error al crear el carrito" });
  }
};

const getCartById = async (req, res) => {
  try {
    const cid = req.params.cid;

    const searchedCart = await cartDao.getCartById(cid);

    if (!searchedCart) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }

    res.json(searchedCart);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el carrito" });
  }
};

const addProductToCart = async (req, res) => {
  try {
    const cid = req.params.cid;
    const pid = req.params.pid;

    const updatedCart = await cartDao.addProductToCart(cid, pid);

    if (updatedCart === null) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }

    if (updatedCart === "PRODUCT_NOT_FOUND") {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    if (updatedCart === "NO_STOCK") {
      return res.status(400).json({ error: "Producto sin stock disponible" });
    }

    res.json(updatedCart);
  } catch (error) {
    res.status(500).json({ error: "Error al agregar el producto al carrito" });
  }
};

const deleteProductFromCart = async (req, res) => {
  try {
    const cid = req.params.cid;
    const pid = req.params.pid;

    const updatedCart = await cartDao.deleteProductFromCart(cid, pid);

    if (updatedCart === null) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }

    if (updatedCart === false) {
      return res
        .status(404)
        .json({ error: "Producto no encontrado en el carrito" });
    }

    res.json(updatedCart);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al eliminar el producto del carrito" });
  }
};

const updateProductQuantity = async (req, res) => {
  try {
    const cid = req.params.cid;
    const pid = req.params.pid;

    const quantity = Number(req.body.quantity);

    if (!quantity || quantity <= 0) {
      return res
        .status(400)
        .json({ error: "La cantidad no puede ser 0 ni menos" });
    }

    const updatedCart = await cartDao.updateProductQuantity(cid, pid, quantity);

    if (updatedCart === null) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }

    if (updatedCart === false) {
      return res
        .status(404)
        .json({ error: "Producto no encontrado en el carrito" });
    }

    res.json(updatedCart);
  } catch (error) {
    res.status(500).json({
      error: "Error al actualizar la cantidad del producto en el carrito",
    });
  }
};

const updateCart = async (req, res) => {
  try {
    const cid = req.params.cid;

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

    const updatedCart = await cartDao.updateCart(cid, products);

    if (!updatedCart) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }

    res.json(updatedCart);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar el carrito" });
  }
};

const clearCart = async (req, res) => {
  try {
    const cid = req.params.cid;

    const clearedCart = await cartDao.clearCart(cid);

    if (!clearedCart) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }

    res.json(clearedCart);
  } catch (error) {
    res.status(500).json({ error: "Error al vaciar el carrito" });
  }
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
