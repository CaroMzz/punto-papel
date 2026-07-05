const productDao = require("../dao/mongo/ProductDao");

const getProducts = async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 10;
    const page = Number(req.query.page) || 1;
    const query = req.query.query;
    const sort = req.query.sort;

    const result = await productDao.getProducts({ limit, page, query, sort });

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener productos" });
  }
};

const getProductById = async (req, res) => {
  try {
    const pid = req.params.pid;

    const searchedProduct = await productDao.getProductById(pid);

    if (!searchedProduct) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    res.json(searchedProduct);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el producto" });
  }
};

const createProduct = async (req, res) => {
  try {
    const title = req.body.title;
    const description = req.body.description;
    const code = req.body.code;
    const price = req.body.price;
    const stock = req.body.stock;
    const category = req.body.category;
    let thumbnails = req.body.thumbnails;

    if (
      !title ||
      !description ||
      !code ||
      price === undefined ||
      stock === undefined ||
      !category
    ) {
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    if (!thumbnails) {
      thumbnails = [];
    }

    const productData = {
      title,
      description,
      code,
      price,
      status: stock > 0,
      stock,
      category,
      thumbnails,
    };

    const createdProduct = await productDao.createProduct(productData);

    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({ error: "Error al crear el producto" });
  }
};

const updateProduct = async (req, res) => {
  try {
    const pid = req.params.pid;

    const updatedData = {
      title: req.body.title,
      description: req.body.description,
      code: req.body.code,
      price: req.body.price,
      stock: req.body.stock,
      category: req.body.category,
      thumbnails: req.body.thumbnails,
    };

    if (req.body.stock !== undefined) {
      updatedData.status = req.body.stock > 0;
    }

    const updatedProduct = await productDao.updateProduct(pid, updatedData);

    if (!updatedProduct) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar el producto" });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const pid = req.params.pid;

    const deletedProduct = await productDao.deleteProduct(pid);

    if (!deletedProduct) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    res.json({
      message: "Producto eliminado con exito",
      deletedProduct,
    });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar el producto" });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
