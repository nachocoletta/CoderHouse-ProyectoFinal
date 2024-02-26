import { getNewId, getJSONFromFile, saveJSONToFile } from '../utils/utils.js'
import { ProductManagerFs } from './ProductManagerFs.js'


export class CartManagerFs {
    constructor(pathCart) {
        this.path = pathCart;
    }

    async addCart() {
        try {
            const cart = await getJSONFromFile(this.path)
            let newCart = {
                id: getNewId(),
                products: []
            }
            cart.push(newCart)
            await saveJSONToFile(this.path, cart)
            return newCart;
        } catch (error) {
            throw new Error(`Error ${error.message}`)
        }
    }

    async getCarts() {
        return getJSONFromFile(this.path);
    }
    async getCartById(id) {
        try {
            const carts = await getJSONFromFile(this.path);
            // console.log("carts f", carts)
            const findedCart = carts.find((c) => c.id === id)

            return findedCart
                ? findedCart
                : `Cart with id ${id} doesn't exists`
        } catch (error) {
            throw new Error(error)
        }
    }

    async addProductToCart(cartId, { productId, quantity, pathProducts }) {
        try {
            const carts = await getJSONFromFile(this.path)
            let cartIndex = carts.findIndex(c => c.id === cartId)

            if (cartIndex >= 0) {
                let findedProduct = carts[cartIndex].products.find(element => element.productId === productId)
                // console.log("findedProduct", findedProduct, productId)
                if (!findedProduct) {
                    const productManager = new ProductManagerFs(pathProducts)
                    let product = await productManager.getProductById(productId)
                    // console.log("product", product)
                    if (typeof product !== 'string') {
                        carts[cartIndex].products.push({ productId, quantity })
                    } else {
                        throw new Error(`Product with id ${productId} doesn't exists`)
                        // console.log(`Product with id ${productId} doesn't exists`)
                    }

                } else {
                    let findedIndex = carts[cartIndex].products.findIndex(prod => prod.productId === productId)

                    carts[cartIndex].products[findedIndex].quantity += quantity
                }
                // console.log(carts[cartIndex])
                await saveJSONToFile(this.path, carts)
            } else {
                console.log(`Cart doesn't exists`)
            }
        } catch (error) {
            throw new Error(`Something is wrong ${error.message}`)
        }
    }

    async getCartProducts(cartId) {
        try {
            const cart = await this.getCartById(cartId)
            return typeof cart !== 'string' ? cart.products : { error: `Cart doesn't exists` }
        } catch (error) {
            throw new Error(`Something is wrong ${error.message}`)
        }
    }
}