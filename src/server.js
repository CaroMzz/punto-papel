require("dotenv").config();

const app = require("./app");
const PORT = 8080;
const connectDB = require("./config/database");

connectDB();

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
