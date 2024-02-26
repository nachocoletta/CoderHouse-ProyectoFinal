import CartModel from "../models/cart.model.js";
import { Exception } from '../helpers/utils.js';

export default class CartManager {
    static async get(query = {}) {
        const criteria = {};
        const result = await CartModel.find(criteria)
        // console.log("result", result);
        return result
    }

    static async getById(cid) {
        const cart = await CartModel.findById(cid);
        if (!cart) {
            throw new Exception('No existe el carrito', 404)
        }
        return cart;
    }

    static async create(newCart = {}) {
        try {
            const cart = await CartModel.create(newCart)
            return cart;
        } catch (error) {
            console.error('Error al crear el carrito', error.message)
            throw new Exception("No se pudo crear el carrito ", 500);
        }
    }

    static async addProductToCart(cartId, productId, quantity) {
        try {
            // console.log("quantity", quantity)
            const cart = await CartModel.findById(cartId);
            // console.log("cart.products: ", cart.products[0].productId._id, productId)
            // return;
            if (!cart) {
                throw new Exception('No se encontro el carrito', 404)
            }

            const existingProductIndex = cart.products.findIndex(
                (product) => String(product.productId._id) === String(productId)
            );
            // console.log(existingProductIndex);
            if (existingProductIndex !== -1) {
                cart.products[existingProductIndex].quantity += Number(quantity)
            } else {
                cart.products.push({ productId, quantity })
            }
            const updatedCart = await cart.save();
            // const productAndQuantity = await CartModel.findByIdAndUpdate(
            //     cartId,
            //     { $push: { products: { productId, quantity } } },
            //     { new: true }
            // )
            // return productAndQuantity
            return updatedCart;
        } catch (error) {
            console.error("Error", error.message);
            throw new Exception("Error al agregar producto al carrito", 500)

        }
    }

    static async removeProductFromCart(cartId, productId) {
        try {
            const cart = await CartModel.findById(cartId);
            if (!cart) {
                throw new Exception('No se encontro el carrito', 404)
            }

            const existingProductIndex = cart.products.findIndex(
                (product) => String(product.productId) === String(productId)
            );

            if (existingProductIndex !== -1) {
                cart.products.splice(existingProductIndex, 1)
            } else {
                throw new Exception('No se encontro el producto en el carrito', 404)
            }

            const updatedCart = await cart.save();

            return updatedCart;
        } catch (error) {
            throw new Exception("Error al eliminar el producto del carrito", 500)
        }
    }
    static async deleteById(cid) {
        const cart = await CartModel.findById(cid);

        if (!cart) {
            throw new Exception('No existe el carrito', 404);
        }
        const criteria = { _id: cid };
        await CartModel.deleteOne(criteria)
        console.log('Carrito eliminado correctamente')
    }

    static async removeAllProductsFromCart(cid) {
        try {
            const cart = await CartModel.findById(cid);

            if (!cart) {
                throw new Exception('No existe el carrito', 404);
            }

            cart.products = [];
            const updatedCart = await cart.save();

            return updatedCart;
        } catch (error) {
            throw new Exception('Error al eliminar los productos del carrito', 500)
        }
    }

    static async updateProductsFromCart(cid, products) {
        try {
            const cart = await CartModel.findById(cid);

            if (!cart) {
                throw new Exception('No existe el carrito', 404);
            }
            // primero que nada vacio el carrito...
            await this.removeAllProductsFromCart(cid);

            products.forEach(prod => {
                this.addProductToCart(cid, prod.productId, prod.quantity)
            })

            const updatedCart = await cart.save();

            return updatedCart;


        } catch (error) {
            throw new Exception('Error al actualizar los productos del carrito', 500)
        }
    }

    static async updateProductQuantityFromCart(cid, pid, quantity) {
        try {
            const cart = await CartModel.findById(cid);

            if (!cart) {
                throw new Exception('No existe el carrito', 404);
            }

            const existingProductIndex = cart.products.findIndex(
                (product) => String(product.productId) === String(pid)
            );
            // console.log(existingProductIndex);
            if (existingProductIndex !== -1) {
                // console.log("existingProductIndex", existingProductIndex);
                cart.products[existingProductIndex].quantity = Number(quantity)
            }

            const updatedCart = await cart.save();

            return updatedCart;
        } catch (error) {
            throw new Exception('Error al actualizar el producto del carrito', 500)

        }
    }
} 