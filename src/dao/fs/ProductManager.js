const fs = require("fs");
const path = require("path")

class ProductManager {
    constructor() {
        this.path = path.join(__dirname, "data", "products.json")
    }

    async getProducts() {
        const data = await fs.promises.readFile(this.path, "utf8");
        return JSON.parse(data);
    }

    async getProductById(id) {
        const products = await this.getProducts();
        return products.find((product) => product.id === id);
    }

    async saveProducts(products) {
        const data = JSON.stringify(products, null, 2);
        await fs.promises.writeFile(this.path, data);
    }

    async createProduct(productData) {
        const products = await this.getProducts();
        const newProduct = {id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1, ...productData };
        products.push(newProduct);
        await this.saveProducts(products);
        return newProduct;
    }

    async updateProduct(id, updatedData) {
        const products = await this.getProducts();
        const searchedId = products.findIndex((product) => product.id === id);
        if(searchedId === -1){
            return null
        }

        const prevProduct = products[searchedId];
        const updatedProduct = {...prevProduct, ...updatedData, id: prevProduct.id }

        updatedProduct.status = updatedProduct.stock > 0;

        products[searchedId] = updatedProduct;
        await this.saveProducts(products);
        return updatedProduct;
    }

    async deleteProduct(id) {
        const products = await this.getProducts();
        const searchedId = products.findIndex((product) => product.id === id);
        if(searchedId === -1){
            return null
        }

        const deletedProduct = products.splice(searchedId, 1)[0];
        await this.saveProducts(products);
        return deletedProduct;
    }
}

module.exports = new ProductManager()