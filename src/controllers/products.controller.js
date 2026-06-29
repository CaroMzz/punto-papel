const products = require("../data/products.data")
const normalizeText = (text) => {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
};

const getProducts = (req, res) => {
    // Filtrar por categoria o disponibilidad
  let resultedProducts = [...products];
  let query = req.query.query;

  if (query) {
    query = normalizeText(query)
    if (query === "true") {
      resultedProducts = resultedProducts.filter(product => product.status === true);
    }
    else if (query === "false") {
      resultedProducts = resultedProducts.filter(product => product.status === false);
    }
    else {
      resultedProducts = resultedProducts.filter(product => normalizeText(product.category) === query);
    }
  } 

  // Ordenar por precio
  let sort = req.query.sort;

  if (sort === "asc") {
    resultedProducts.sort((product1, product2) => product1.price - product2.price);
  }

  if (sort === "desc") {
    resultedProducts.sort((product1, product2) => product2.price - product1.price);
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

  prevLink = (hasPrevPage === true) ? `/api/products?limit=${limit}&page=${prevPage}` : null;
  nextLink = (hasNextPage === true) ? `/api/products?limit=${limit}&page=${nextPage}` : null;

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
}

const getProductById = (req, res) => {
  const pid = Number(req.params.pid);
  const searchedProduct = products.find((product) => product.id === pid);

  if (!searchedProduct) {
    return res.status(404).send({ error: "Producto no encontrado" });
  }

  res.json(searchedProduct);
}

const createProduct = (req, res) => {
  const title = req.body.title;
  const description = req.body.description;
  const code = req.body.code;
  const price = req.body.price;
  const stock = req.body.stock;
  const category = req.body.category;
  let thumbnails = req.body.thumbnails;

  if (!title || !description || !code || price === undefined || stock === undefined || !category) {
    res.status(400).send({ error: "Faltan campos obligatorios" });
    return;
  }

  let newId;
  if (products.length > 0) {
    const lastProduct = products[products.length - 1];
    newId = lastProduct.id + 1;
  } else {
    newId = 1;
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

  const newProduct = {
    id: newId,
    title: title,
    description: description,
    code: code,
    price: price,
    status: status,
    stock: stock,
    category: category,
    thumbnails: thumbnails,
  };

  products.push(newProduct);

  res.status(201).json(newProduct);
}

const updateProduct = (req, res) => {
  const pid = Number(req.params.pid);
  const searchedId = products.findIndex((product) => product.id === pid);

  if (searchedId === -1) {
    return res.status(404).json({ error: "El producto no existe" });
  }

  const prevProduct = products[searchedId];

  const title = req.body.title;
  const description = req.body.description;
  const code = req.body.code;
  const price = req.body.price;
  const stock = req.body.stock;
  const category = req.body.category;
  let thumbnails = req.body.thumbnails;

  const finalStock = stock ?? prevProduct.stock;

  const updatedProduct = {
    id: prevProduct.id,
    title: title ?? prevProduct.title,
    description: description ?? prevProduct.description,
    code: code ?? prevProduct.code,
    price: price ?? prevProduct.price,
    status: finalStock > 0,
    stock: finalStock,
    category: category ?? prevProduct.category,
    thumbnails: thumbnails ?? prevProduct.thumbnails,
  };

  products[searchedId] = updatedProduct;

  res.json(updatedProduct);
}

const deleteProduct = (req, res) => {
  const pid = Number(req.params.pid);
  const searchedId = products.findIndex((product) => product.id === pid);

  if (searchedId === -1) {
    return res.status(404).json({ error: "El id no existe" });
  }

  products.splice(searchedId, 1);

  res.json({ message: "Producto eliminado con éxito" });
}

module.exports = {getProducts, getProductById, createProduct, updateProduct, deleteProduct}