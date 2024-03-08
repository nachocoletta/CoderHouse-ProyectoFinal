import CartsService from "../services/carts.services.js";
import { Exception } from "../helpers/utils.js";
import UsersService from "../services/users.services.js";
import ProductsController from "./products.controller.js";
import TicketController from "./ticket.controller.js";
import { getNewId } from "../helpers/utils.js";
export default class CartController {

    static async get(filter = {}) {
        const carts = await CartsService.findAll(filter)
        return carts;
    }

    static async create(newCart = {}) {
        const cart = await CartsService.create(newCart)
        return cart;
    }

    static async getById(cid) {
        return await CartsService.findById(cid)
    }


    static async deleteById(cid) {
        await CartController.getById(cid)
        req.logger.info("Eliminando el carrito");
        await CartsService.deleteById(cid);
        req.logger.info("Carrito eliminado correctamente");
    }

    static async addProductToCart(cartId, productId, quantity) {
        try {
            // console.log('entra al controlador');
            // console.log("cartId", cartId)
            const user = await UsersService.findAll({ cartId })

            if (user[0].rol === 'admin') {
                throw new Exception('El admin no puede agregar productos al carrito', 401)
            }
            const cart = await CartController.getById(cartId)
            // console.log("quantity", quantity)
            // const cart = await CartModel.findById(cartId);
            // console.log("cart.products: ", cart.products[0].productId._id, productId)
            // return;
            if (!cart) {
                throw new Exception('No se encontro el carrito', 404)
            }
            console.log("cart.products", cart.products)
            const existingProductIndex = cart.products.findIndex(
                (product) => String(product.productId._id) === String(productId)
            );
            // console.log(existingProductIndex);
            if (existingProductIndex !== -1) {
                cart.products[existingProductIndex].quantity += Number(quantity)
            } else {
                cart.products.push({ productId, quantity })
            }

            console.log("cart.products", cart.products)
            const updatedCart = await CartsService.updateById(cartId, cart.products);

            const cartUpdated = await CartsService.findById(cartId);
            // console.log("cartUpdated", cartUpdated)
            return cartUpdated;
            // return updatedCart;
        } catch (error) {
            console.error("Error", error.message);
            throw new Exception("Error al agregar producto al carrito", 500)

        }
    }

    static async removeProductFromCart(cid, productId) {
        try {
            const cart = await CartController.getById(cid);
            if (!cart) {
                throw new Exception('No se encontro el carrito', 404)
            }
            // console.log(productId);
            // console.log(cart);
            // console.log("cart.products", cart.products)

            const existingProductIndex = cart.products.findIndex(
                (product) => String(product.productId._id) === String(productId)
            );



            if (existingProductIndex !== -1) {
                // console.log("existingProduct", existingProductIndex);
                cart.products.splice(existingProductIndex, 1)
                // console.log("cart.products", cart.products)
                // const updatedCart = await CartsService.updateById(cid, cart)
                const updatedCart = await CartsService.updateById(cid, cart.products)

                return updatedCart;
            } else {
                throw new Exception('No se encontro el producto en el carrito', 404)
            }


        } catch (error) {
            throw new Exception("Error al eliminar el producto del carrito", 500)
        }
    }

    static async removeAllProductsFromCart(cid) {
        try {
            const cart = await CartController.getById(cid);

            if (!cart) {
                throw new Exception('No existe el carrito', 404);
            }

            cart.products = [];

            const updatedCart = await CartsService.updateById(cid, cart.products)

            return updatedCart;
        } catch (error) {
            throw new Exception('Error al eliminar los productos del carrito', 500)
        }
    }

    static async updateProductQuantityFromCart(cid, pid, quantity) {
        try {
            const cart = await CartsService.findById(cid);

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

            const updatedCart = await CartsService.updateById(cid, cart.products)


            return updatedCart;
        } catch (error) {
            throw new Exception('Error al actualizar el producto del carrito', 500)

        }
    }

    static async updateProductsFromCart(cid, products) {
        try {
            const cart = await CartsService.findById(cid);
            // console.log("cid", cid)
            // console.log("products", products)
            // console.log(typeof products)
            if (!cart) {
                throw new Exception('No existe el carrito', 404);
            }
            // primero que nada vacio el carrito...
            await CartController.removeAllProductsFromCart(cid);
            // console.log('carrito vacio', await CartController.getById(cid))
            // console.log('products.products', products.products)
            products.products.forEach(async (prod) => {
                // console.log("prod", cid, prod)
                await CartController.addProductToCart(cid, prod.productId, prod.quantity)
            })


            const updatedCart = await cart.save();

            return updatedCart;


        } catch (error) {
            throw new Exception('Error al actualizar los productos del carrito', 500)
        }
    }
    static async createPurchase(cid) {
        try {
            const user = await UsersService.findAll({ cartId: cid });
            let amount = 0;

            // console.log("user", user)
            if (user.length > 0) {
                let cart = await CartsService.findById({ _id: user[0].cartId._id });

                // console.log("cart en createPurchase", cart)
                if (cart.products.length > 0) {
                    let productsWithoutStock = [];
                    let productsWithStock = [];
                    let updatedProducts;

                    for (const [index, prod] of cart.products.entries()) {
                        if (prod.productId.stock < prod.quantity) {
                            // console.log('Stock insuficiente');
                            productsWithoutStock.push({ _id: prod.productId._id, quantity: prod.quantity });
                        } else {
                            // console.log('Hay stock');
                            productsWithStock.push({ _id: prod.productId._id, quantity: prod.quantity });
                            updatedProducts = await ProductsController.updateById(prod.productId._id, {
                                stock: prod.productId.stock - prod.quantity,
                            });

                            amount += prod.productId.price * prod.quantity;

                            // Remove product from cart (without worrying about concurrency)
                            cart = await CartController.removeProductFromCart(cid, prod.productId._id);
                        }
                    }

                    // Generate ticket after processing all products
                    const ticket = await TicketController.create({
                        code: getNewId(),
                        purchase_datetime: Date.now(),
                        amount,
                        purchaser: user[0].email,
                    });

                    return { user, productsWithoutStock, cart, ticket };
                } else {
                    throw new Error('El carrito esta vacio, no se puede realizar la compra')
                }
            }
        } catch (error) {
            console.log("Error", error.message)
        }
    }

    // static async createPurchase(cid) {

    //     const user = await UsersService.findAll({ cartId: cid })
    //     let amount = 0;
    //     if (user.length > 0) {
    //         let cart = await CartsService.findById({ _id: user[0].cartId })

    //         let productsWithoutStock = [];
    //         let productsWithStock = [];
    //         let updatedProducts;
    //         for (const [index, prod] of cart.products.entries()) {
    //             if (prod.productId.stock < prod.quantity) {
    //                 console.log('Stock insuficiente');
    //                 productsWithoutStock.push({ _id: prod.productId._id, quantity: prod.quantity });
    //             } else {
    //                 console.log('Hay stock');
    //                 productsWithStock.push({ _id: prod.productId._id, quantity: prod.quantity });
    //                 updatedProducts = await ProductsController.updateById(prod.productId._id, {
    //                     stock: prod.productId.stock - prod.quantity,
    //                 });

    //                 amount += prod.productId.price * prod.quantity;
    //                 // console.log('amount', amount);

    //                 // console.log('removing...', cid, prod.productId, index);
    //                 // console.log('prev', index, cart);

    //                 cart = await CartController.removeProductFromCart(cid, prod.productId._id);

    //                 // console.log('post', index, cart);
    //             }
    //         }

    //         // await Promise.all(cart.products.map(async (prod, index) => {
    //         //     if (prod.productId.stock < prod.quantity) {
    //         //         console.log('Stock insuficiente');
    //         //         productsWithoutStock.push({ _id: prod.productId._id, quantity: prod.quantity })
    //         //     } else {
    //         //         // console.log('Hay stock')
    //         //         productsWithStock.push({ _id: prod.productId._id, quantity: prod.quantity })
    //         //         updatedProducts = await ProductsController.updateById(prod.productId._id,
    //         //             {
    //         //                 stock: prod.productId.stock - prod.quantity
    //         //             }
    //         //         )
    //         //         // console.log(`price ${prod.productId.price} * ${prod.quantity}`);
    //         //         amount += prod.productId.price * prod.quantity
    //         //         // console.log('amount', amount)
    //         //         // console.log("removing...", cid, prod.productId, index)
    //         //         console.log("prev", index, cart)
    //         //         cart = await CartController.removeProductFromCart(cid, prod.productId._id)
    //         //         console.log("post", index, cart)
    //         //     }
    //         // }))
    //         // console.log('amount', amount)
    //         const ticket = await TicketController.create({
    //             code: getNewId(),
    //             purchase_datetime: Date.now(),
    //             amount,
    //             purchaser: user[0].email
    //         })
    //         return { user, productsWithoutStock, cart, ticket }
    //     }


    // }
}