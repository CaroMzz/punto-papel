const express = require("express");
const router = express.Router();
const products = [
  {
    id: 1,
    title: "Cuaderno A4 Rayado",
    description: "Cuaderno de 100 hojas rayadas tamaño A4",
    code: "CUA001",
    price: 4500,
    status: true,
    stock: 25,
    category: "Cuadernos",
    thumbnails: [],
  },
  {
    id: 2,
    title: "Agenda 2026",
    description: "Agenda diaria con tapa dura y diseño floral",
    code: "AGE001",
    price: 8900,
    status: true,
    stock: 12,
    category: "Agendas",
    thumbnails: [],
  },
  {
    id: 3,
    title: "Set de Resaltadores Pastel",
    description: "Pack de 6 resaltadores de colores pastel",
    code: "RES001",
    price: 3200,
    status: true,
    stock: 18,
    category: "Marcadores",
    thumbnails: [],
  },
  {
    id: 4,
    title: "Lapicera Gel Negra",
    description: "Lapicera de tinta gel color negro",
    code: "LAP001",
    price: 1200,
    status: true,
    stock: 50,
    category: "Escritura",
    thumbnails: [],
  },
  {
    id: 5,
    title: "Carpeta A4 con Anillos",
    description: "Carpeta rígida con mecanismo de 3 anillos",
    code: "CAR001",
    price: 5600,
    status: true,
    stock: 15,
    category: "Organización",
    thumbnails: [],
  },
  {
    id: 6,
    title: "Notas Adhesivas",
    description: "Block de notas adhesivas multicolor",
    code: "NOT001",
    price: 1800,
    status: false,
    stock: 0,
    category: "Oficina",
    thumbnails: [],
  },
  {
    id: 7,
    title: "Lápices de Colores x12",
    description: "Caja de 12 lápices de colores",
    code: "LAP002",
    price: 3900,
    status: true,
    stock: 20,
    category: "Arte",
    thumbnails: [],
  },
  {
    id: 8,
    title: "Regla Metálica 30 cm",
    description: "Regla de aluminio resistente de 30 cm",
    code: "REG001",
    price: 1500,
    status: true,
    stock: 30,
    category: "Accesorios",
    thumbnails: [],
  },
];

const normalizeText = (text) => {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
};

/* --- Obtener todos los productos --- */
router.get("/", (req, res) => {
  // Filtrar por categoria o disponibilidad
  let resultedProducts = [...products];
  let query = req.query.query;

  if (query) {
    normalizeText(query)
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
});

// Obtener los productos por id
router.get("/:pid", (req, res) => {
  const pid = Number(req.params.pid);
  const searchedProduct = products.find((product) => product.id === pid);

  if (!searchedProduct) {
    return res.status(404).send({ error: "Producto no encontrado" });
  }

  res.json(searchedProduct);
});

// Crear un nuevo producto
router.post("/", (req, res) => {
  const title = req.body.title;
  const description = req.body.description;
  const code = req.body.code;
  const price = req.body.price;
  const stock = req.body.stock;
  const category = req.body.category;
  let thumbnails = req.body.thumbnails;

  if (!title || !description || !code || !price || !stock || !category) {
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
});

// Actualizar un producto
router.put("/:pid", (req, res) => {
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
});

// Eliminar un producto
router.delete("/:pid", (req, res) => {
  const pid = Number(req.params.pid);
  const searchedId = products.findIndex((product) => product.id === pid);

  if (searchedId === -1) {
    return res.status(404).json({ error: "El id no existe" });
  }

  products.splice(searchedId, 1);

  res.json({ message: "Producto eliminado con éxito" });
});

module.exports = router;
