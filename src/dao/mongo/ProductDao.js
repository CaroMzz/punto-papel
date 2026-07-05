const Product = require("../../models/product.model");

class ProductDao {
  async getProducts({ limit = 10, page = 1, query, sort }) {
    const filter = {};

    if (query) {
      if (query === "true" || query === "false") {
        filter.status = query === "true";
      } else {
        filter.category = query;
      }
    }

    const sortOptions = {};

    if (sort === "asc") {
      sortOptions.price = 1;
    }

    if (sort === "desc") {
      sortOptions.price = -1;
    }

    const skip = (page - 1) * limit;

    const products = await Product.find(filter)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);

    const totalDocs = await Product.countDocuments(filter);
    const totalPages = Math.ceil(totalDocs / limit);

    return {
      status: "success",
      payload: products,
      totalPages,
      prevPage: page > 1 ? page - 1 : null,
      nextPage: page < totalPages ? page + 1 : null,
      page,
      hasPrevPage: page > 1,
      hasNextPage: page < totalPages,
      prevLink:
        page > 1 ? `/api/products?limit=${limit}&page=${page - 1}` : null,
      nextLink:
        page < totalPages
          ? `/api/products?limit=${limit}&page=${page + 1}`
          : null,
    };
  }

  async getProductById(id) {
    const product = await Product.findById(id);
    return product;
  }

  async createProduct(productData) {
    const createdProduct = await Product.create(productData);
    return createdProduct;
  }

  async updateProduct(id, updatedData) {
    const updatedProduct = await Product.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true,
    });

    return updatedProduct;
  }

  async deleteProduct(id) {
    const deletedProduct = await Product.findByIdAndDelete(id);
    return deletedProduct;
  }
}

module.exports = new ProductDao();
