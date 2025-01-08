import fs from "node:fs";
import crypto from 'crypto';
import path from 'path';

class ProductManager {
    constructor(path) {
        this.path = path;
    }

    async getProducts() {
        try {
            if (fs.existsSync(this.path)) {
                const productos = await fs.promises.readFile(this.path, "utf-8");
                return JSON.parse(productos);
              } else return [];
        } catch (err) {
            throw new Error(err.message);
        }
    }

    async getProductById(id) {
        try {
            const productos = await this.getProducts();
            const productoBuscado = productos.find((p) => p.id === id);
            if (!productoBuscado) throw new Error("El producto no existe");
            return productoBuscado;
        } catch (err) {
            throw new Error(err.message);
        }
    }

    async addProduct(producto) {
        try {
            const newProduct = {
                id: crypto.randomBytes(10).toString('hex'),
                ...producto
            };
            const productos = await this.getProducts();
            productos.push(newProduct);
            await fs.promises.writeFile(this.path, JSON.stringify(productos));
            return newProduct;
        } catch (err) {
            throw new Error(err.message);
        }
    }

    async update(producto, id) {
        try {
            const productos = await this.getProducts();
            let productoActualizar = await this.getProductById(id);
            productoActualizar = { ...productoActualizar, ...producto };

            const productosActualizado = productos.filter((prod) => prod.id !== id);
            productosActualizado.push(productoActualizar);

            await fs.promises.writeFile(this.path, JSON.stringify(productosActualizado));
            return productoActualizar;
        } catch (err) {
            throw new Error(err.message);
        }
    }

    async delete(id) {
        try {
            const productoEliminar = await this.getProductById(id);
            const productos = await this.getProducts();
            const productosActualizado = productos.filter((prod) => prod.id !== id);
            await fs.promises.writeFile(this.path, JSON.stringify(productosActualizado));
            return productoEliminar;
        } catch (err) {
            throw new Error(err.message);
        }
    }

    async filterProducts(gender, category, marca, color, order) {
        try {
            const productos = await this.getProducts();
            let productosFiltrados =  productos;// valor inicial: todos los productos

            if (gender) {
                productosFiltrados = productosFiltrados.filter(prod => prod.gender.toLowerCase() === gender.toLowerCase());
            }
            if (category) {
                productosFiltrados = productosFiltrados.filter(prod => prod.category.toLowerCase() === category.toLowerCase());
            }
            if (marca) {
                productosFiltrados = productosFiltrados.filter(prod => prod.marca.toLowerCase() === marca.toLowerCase());
            }
            if (color) {
                productosFiltrados = productosFiltrados.filter(prod => prod.color.toLowerCase() === color.toLowerCase());
            }
            if (order) {
                if (order === 'alfabeticamente') {
                    productosFiltrados = productosFiltrados.sort((prod1, prod2) => prod1.title.localeCompare(prod2.title));
                } else if (order === 'precio-ascendente') {
                    productosFiltrados = productosFiltrados.sort((prod1, prod2) => prod1.price - prod2.price);
                } else if (order === 'precio-descendente') {
                    productosFiltrados = productosFiltrados.sort((prod1, prod2) => prod2.price - prod1.price);
                }
            }

            if (productosFiltrados.length === 0) throw new Error("No hay productos con los filtros indicados.");
            return productosFiltrados;

        } catch (err) {
            throw new Error(err.message);
        }
    }
}

export const productManager = new ProductManager(path.join(process.cwd(), "src/data/products.json"));