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

  const listProducts = []

  const newCart = {
    id: newId,
    products: listProducts
  }

  carts.push(newCart)

  res.status(201).json(newCart)
});

// Mostrar carrito según id
router.get("/:cid", (req, res) => {
    const cid = Number(req.params.cid)
    const searchedCart = carts.find((cart) => cart.id === cid)

    if(!searchedCart){
        return res.status(404).json({error: "Carrito no encontrado"})
    }

    res.json(searchedCart)
})

// Agregar producto a un carrito
router.post("/:cid/products/:pid", (req, res) => {
    const cid = Number(req.params.cid)
    const pid = Number(req.params.pid)
    const searchedCart = carts.find((cart) => cart.id === cid)

    if(!searchedCart){
        return res.status(404).json({error: "Carrito no encontrado"})
    }

    const searchedProduct = searchedCart.products.find((item) => item.product === pid)

    if(searchedProduct){
        searchedProduct.quantity = searchedProduct.quantity + 1
    } else {
        searchedCart.products.push({ product: pid, quantity: 1 })
    }

    res.json(searchedCart)
})

module.exports = router;