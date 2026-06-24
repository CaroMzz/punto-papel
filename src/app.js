const express = require('express')
const app = express()
const productsRouter = require('./routes/products.routes')
const cartsRouter = require('./routes/carts.routes')

app.use(express.json())
app.get('/', (req, res) => {
    res.send('Servidor funcionando')
})

app.use('/api/products', productsRouter)
app.use('/api/carts', cartsRouter)

module.exports = app
