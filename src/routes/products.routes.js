const express = require("express");
const router = express.Router();
const products = [
  {
    id: 1,
    nombre: "Cuaderno A4 Rayado",
    categoria: "Cuadernos",
    precio: 4500,
    stock: 25,
  },
  {
    id: 2,
    nombre: "Set de Resaltadores Pastel",
    categoria: "Marcadores",
    precio: 3200,
    stock: 18,
  },
  {
    id: 3,
    nombre: "Agenda 2026",
    categoria: "Agendas",
    precio: 8900,
    stock: 12,
  },
  {
    id: 4,
    nombre: "Lapicera Gel Negra",
    categoria: "Escritura",
    precio: 1200,
    stock: 50,
  },
  {
    id: 5,
    nombre: "Carpeta A4 con Anillos",
    categoria: "Organización",
    precio: 5600,
    stock: 15,
  },
  {
    id: 6,
    nombre: "Notas Adhesivas de Colores",
    categoria: "Oficina",
    precio: 1800,
    stock: 40,
  },
  {
    id: 7,
    nombre: "Lápices de Colores x12",
    categoria: "Arte",
    precio: 3900,
    stock: 20,
  },
  {
    id: 8,
    nombre: "Regla Metálica 30 cm",
    categoria: "Accesorios",
    precio: 1500,
    stock: 30,
  },
];

// Obtener todos los productos
router.get("/", (req, res) => {
  res.json(products);
});

module.exports = router;
