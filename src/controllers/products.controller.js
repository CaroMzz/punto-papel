const productManager = require("../dao/fs/ProductManager");
const normalizeText = (text) => {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
};

const getProducts = async (req, res) => {
  try {
    const productsFromFile = await productManager.getProducts();

    // Filtrar por categoria o disponibilidad
    let resultedProducts = [...productsFromFile];
    let query = req.query.query;

    if (query) {
      query = normalizeText(query);
      if (query === "true") {
        resultedProducts = resultedProducts.filter(
          (product) => product.status === true,
        );
      } else if (query === "false") {
        resultedProducts = resultedProducts.filter(
          (product) => product.status === false,
        );
      } else {
        resultedProducts = resultedProducts.filter(
          (product) => normalizeText(product.category) === query,
        );
      }
    }

    // Ordenar por precio
    let sort = req.query.sort;

    if (sort === "asc") {
      resultedProducts.sort(
        (product1, product2) => product1.price - product2.price,
      );
    }

    if (sort === "desc") {
      resultedProducts.sort(
        (product1, product2) => product2.price - product1.price,
      );
    }

    // Limitar y paginar
    let limit = Number(req.query.limit);
    let page = Number(req.query.page);

    if (!limit) {
      limit = 10;
    }
    if (!page) {
      page = 1;
    }

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    const limitedProducts = resultedProducts.slice(startIndex, endIndex);

    const totalPages = Math.ceil(resultedProducts.length / limit);
    let prevPage, nextPage, hasPrevPage, hasNextPage;
    let prevLink, nextLink;

    if (page === 1) {
      prevPage = null;
      hasPrevPage = false;
    } else {
      prevPage = page - 1;
      hasPrevPage = true;
    }

    if (page < totalPages) {
      nextPage = page + 1;
      hasNextPage = true;
    } else {
      nextPage = null;
      hasNextPage = false;
    }

    prevLink =
      hasPrevPage === true
        ? `/api/products?limit=${limit}&page=${prevPage}`
        : null;
    nextLink =
      hasNextPage === true
        ? `/api/products?limit=${limit}&page=${nextPage}`
        : null;

    res.json({
      status: "success",
      payload: limitedProducts,
      totalPages: totalPages,
      page: page,
      prevPage: prevPage,
      nextPage: nextPage,
      hasPrevPage: hasPrevPage,
      hasNextPage: hasNextPage,
      prevLink: prevLink,
      nextLink: nextLink,
    });
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los productos" });
  }
};

const getProductById = async (req, res) => {
  try {
    const pid = Number(req.params.pid);
    const searchedProduct = await productManager.getProductById(pid);

    if (!searchedProduct) {
      return res.status(404).send({ error: "Producto no encontrado" });
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
      return res.status(400).send({ error: "Faltan campos obligatorios" });
    }

    if (!thumbnails) {
      thumbnails = [];
    } else {
      thumbnails = req.body.thumbnails;
    }

    let status;
    if (stock > 0) {
      status = true;
    } else {
      status = false;
    }

    const productData = {
      title: title,
      description: description,
      code: code,
      price: price,
      status: status,
      stock: stock,
      category: category,
      thumbnails: thumbnails,
    };

    const createdProduct = await productManager.createProduct(productData);

    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({ error: "Error al crear el producto" });
  }
};

const updateProduct = async (req, res) => {
  try {
    const pid = Number(req.params.pid);

    const updatedData = {
      title: req.body.title,
      description: req.body.description,
      code: req.body.code,
      price: req.body.price,
      stock: req.body.stock,
      category: req.body.category,
      thumbnails: req.body.thumbnails,
    };

    const updatedProduct = await productManager.updateProduct(pid, updatedData);

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
    const pid = Number(req.params.pid);

    const deletedProduct = await productManager.deleteProduct(pid);
    if (!deletedProduct) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    res.json({ message: "Producto eliminado con éxito", deletedProduct });
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
