const fs = require("fs");
const path = require("path");

class CartManager {
  constructor() {
    this.path = path.join(__dirname, "data", "carts.json");
  }

  async getCarts() {
    const data = await fs.promises.readFile(this.path, "utf8");
    return JSON.parse(data);
  }

  async saveCarts(carts) {
    const data = JSON.stringify(carts, null, 2);
    await fs.promises.writeFile(this.path, data);
  }

  async createCart() {
    const carts = await this.getCarts();
    let newId;

    if (carts.length > 0) {
      newId = Math.max(...carts.map((cart) => cart.id)) + 1;
    } else {
      newId = 1;
    }

    const newCart = { id: newId, products: [] };
    carts.push(newCart);
    await this.saveCarts(carts);
    return newCart;
  }

  async getCartById(id) {
    const carts = await this.getCarts();
    return carts.find((cart) => cart.id === id);
  }

  async addProductToCart(cid, pid) {
    const carts = await this.getCarts();
    const searchedCart = carts.find((cart) => cart.id === cid);

    if (!searchedCart) {
      return null;
    }

    const searchedProduct = searchedCart.products.find(
      (item) => item.product === pid,
    );

    if (searchedProduct) {
      searchedProduct.quantity = searchedProduct.quantity + 1;
    } else {
      searchedCart.products.push({ product: pid, quantity: 1 });
    }
    await this.saveCarts(carts);
    return searchedCart;
  }

  async deleteProductFromCart(cid, pid) {
    const carts = await this.getCarts();
    const searchedCart = carts.find((cart) => cart.id === cid);

    if (!searchedCart) {
      return null;
    }

    const searchedIndexProduct = searchedCart.products.findIndex(
      (item) => item.product === pid,
    );

    if (searchedIndexProduct === -1) {
      return null;
    }

    searchedCart.products.splice(searchedIndexProduct, 1);
    await this.saveCarts(carts);
    return searchedCart;
  }

  async updateProductQuantity(cid, pid, quantity) {
    const carts = await this.getCarts();
    
    const searchedCart = carts.find((cart) => cart.id === cid);
    if (!searchedCart) {
      return null;
    }

    const searchedProduct = searchedCart.products.find(
      (item) => item.product === pid,
    );
    if (!searchedProduct) {
      return false;
    }

    searchedProduct.quantity = quantity;
    await this.saveCarts(carts);
    return searchedCart;
  }

  async updateCart(cid, products) {
    const carts = await this.getCarts();
    
    const searchedCart = carts.find((cart) => cart.id === cid);
    if (!searchedCart) {
      return null;
    }

    searchedCart.products = products;
    await this.saveCarts(carts);
    return searchedCart;
  }

  async clearCart(cid) {
    const carts = await this.getCarts();
    
    const searchedCart = carts.find((cart) => cart.id === cid);
    if (!searchedCart) {
      return null;
    }

    searchedCart.products = [];
    await this.saveCarts(carts);
    return searchedCart;
  }
}

module.exports = new CartManager();
