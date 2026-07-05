# Punto Papel

Proyecto backend de e-commerce para una tienda de papeleria, organizacion y escritorio. La aplicacion permite gestionar productos, crear carritos, agregar productos al carrito, actualizar cantidades y visualizar informacion desde API REST y vistas con Handlebars.

## Tecnologias

- Node.js
- Express
- MongoDB
- Mongoose
- Handlebars
- FileSystem
- Postman para pruebas

## Instalacion

1. Clonar el repositorio.
2. Instalar dependencias:

```bash
npm install
```

3. Crear un archivo `.env` en la raiz del proyecto usando como referencia `.env.example`.

```txt
MONGO_URI=mongodb://127.0.0.1:27017/ecommerce
```

4. Asegurarse de tener MongoDB iniciado.
5. Levantar el servidor en modo desarrollo:

```bash
npm run dev
```

El servidor corre en:

```txt
http://localhost:8080
```

## Scripts

```bash
npm run dev
```

Inicia el servidor con Nodemon.

```bash
npm start
```

Inicia el servidor con Node.

## Vistas

- `GET /products`: listado de productos.
- `GET /products/:pid`: detalle de producto.
- `GET /carts/:cid`: detalle de carrito.

## API de productos

### Listar productos

```txt
GET /api/products
```

Query params disponibles:

- `limit`: cantidad de productos por pagina.
- `page`: pagina actual.
- `query`: filtro por categoria o disponibilidad (`true` / `false`).
- `sort`: orden por precio (`asc` / `desc`).

Ejemplo:

```txt
GET /api/products?limit=5&page=1&sort=asc
```

### Obtener producto por ID

```txt
GET /api/products/:pid
```

### Crear producto

```txt
POST /api/products
```

Body ejemplo:

```json
{
  "title": "Cuaderno A5",
  "description": "Cuaderno chico rayado",
  "code": "CUA999",
  "price": 2500,
  "stock": 10,
  "category": "Cuadernos",
  "thumbnails": []
}
```

### Actualizar producto

```txt
PUT /api/products/:pid
```

### Eliminar producto

```txt
DELETE /api/products/:pid
```

## API de carritos

### Crear carrito

```txt
POST /api/carts
```

### Obtener carrito por ID

```txt
GET /api/carts/:cid
```

Esta ruta utiliza `populate` para mostrar la informacion completa de los productos del carrito.

### Agregar producto al carrito

```txt
POST /api/carts/:cid/products/:pid
```

Al agregar un producto, se descuenta una unidad del stock.

### Eliminar producto del carrito

```txt
DELETE /api/carts/:cid/products/:pid
```

### Actualizar cantidad de un producto

```txt
PUT /api/carts/:cid/products/:pid
```

Body ejemplo:

```json
{
  "quantity": 3
}
```

### Reemplazar productos del carrito

```txt
PUT /api/carts/:cid
```

Body ejemplo:

```json
{
  "products": [
    {
      "product": "ID_DEL_PRODUCTO",
      "quantity": 2
    }
  ]
}
```

### Vaciar carrito

```txt
DELETE /api/carts/:cid
```

## Persistencia

El proyecto conserva una implementacion con FileSystem en:

```txt
src/dao/fs
```

La version principal utiliza MongoDB y Mongoose en:

```txt
src/dao/mongo
src/models
```

## Estructura principal

```txt
src/
  config/
  controllers/
  dao/
    fs/
    mongo/
  models/
  public/
  routes/
  views/
```

## Notas

MongoDB genera automaticamente los identificadores `_id`, por eso los endpoints que reciben `:pid` o `:cid` deben usar IDs de MongoDB.
