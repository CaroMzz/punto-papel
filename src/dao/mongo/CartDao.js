const Cart = require("../../models/cart.model");

class CartDao {
  async createCart() {
    const createdCart = await Cart.create({ products: [] });
    return createdCart;
  }

  async getCartById(id) {
    const cart = await Cart.findById(id).populate("products.product");
    return cart;
  }

  async addProductToCart(cartId, productId) {
    const cart = await Cart.findById(cartId);

    if (!cart) {
      return null;
    }

    const productInCart = cart.products.find(
      (item) => item.product.toString() === productId,
    );

    if (productInCart) {
      productInCart.quantity += 1;
    } else {
      cart.products.push({
        product: productId,
        quantity: 1,
      });
    }

    await cart.save();

    return await Cart.findById(cartId).populate("products.product");
  }

  async deleteProductFromCart(cartId, productId) {
    const cart = await Cart.findById(cartId);

    if (!cart) {
      return null;
    }

    const productIndex = cart.products.findIndex(
      (item) => item.product.toString() === productId,
    );

    if (productIndex === -1) {
      return false;
    }

    cart.products.splice(productIndex, 1);

    await cart.save();

    return await Cart.findById(cartId).populate("products.product");
  }

  async updateProductQuantity(cartId, productId, quantity) {
    const cart = await Cart.findById(cartId);

    if (!cart) {
      return null;
    }

    const productInCart = cart.products.find(
      (item) => item.product.toString() === productId,
    );

    if (!productInCart) {
      return false;
    }

    productInCart.quantity = quantity;

    await cart.save();

    return await Cart.findById(cartId).populate("products.product");
  }

  async updateCart(cartId, products) {
    const updatedCart = await Cart.findByIdAndUpdate(
      cartId,
      { products },
      {
        new: true,
        runValidators: true,
      },
    ).populate("products.product");

    return updatedCart;
  }

  async clearCart(cartId) {
    const updatedCart = await Cart.findByIdAndUpdate(
      cartId,
      { products: [] },
      {
        new: true,
        runValidators: true,
      },
    ).populate("products.product");

    return updatedCart;
  }
}

module.exports = new CartDao();
