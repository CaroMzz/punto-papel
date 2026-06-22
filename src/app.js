const express = require('express')
const productsRouter = require('./routes/products.routes')
const app = express()
const PORT = 8080

app.use(express.json())
app.get('/', (req, res) => {
    res.send('Servidor funcionando')
})

app.use('/api/products', productsRouter)

module.exports = app
