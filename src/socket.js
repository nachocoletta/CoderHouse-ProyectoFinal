// socket.js
import { initDb } from './db/mongodb.js'
import { Server } from 'socket.io';
// import mongoose from 'mongoose';
// import ProductManager from './dao/ProductManager.js';
import ProductsController from './controllers/products.controller.js';
import CartController from './controllers/cart.controller.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
// import CartManager from './dao/CartManager.js';
// import MessageManager from './dao/MessageManager.js';
import MessageController from './controllers/message.controller.js';

import { verifyToken } from './helpers/utils.js';
import UsersController from './controllers/users.controller.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const absolutePath = path.resolve(__dirname, '../src/data/products.json');

let io;
let messages = []

export const init = async (httpServer) => {

    await initDb();

    io = new Server(httpServer);

    io.on('connection', async (socketClient) => {

        // const token = socketClient.handshake.headers.authorization.split(' ')[1];

        // console.log("token", token)

        console.log(`Se ha conectado un nuevo cliente 🎉 (${socketClient.id})`);

        const messages = await MessageController.get();
        // console.log('messages', messages)
        socketClient.emit('listMessages', messages);

        // socketClient.emit('notification', { messages });

        socketClient.broadcast.emit('new-client');

        socketClient.on('new-message', async (data) => {
            const { username, text } = data;
            let newMessage = await MessageController.create(data)
            // messages.push({ username, text });
            let allMessages = await MessageController.get();
            // console.log("allMessages", allMessages);
            io.emit('notification', allMessages);
        })

        const products = await ProductsController.get()
        socketClient.emit('listProducts', products)

        const carts = await CartController.get();
        // console.log("carts", JSON.stringify(carts))
        socketClient.emit('listCarts', carts)

        socketClient.on('addProduct', async (newProduct) => {
            // await ProductManager.create(newProduct);
            // let products = await ProductManager.get();
            await ProductsController.create(newProduct)
            let products = await ProductsController.get()
            io.emit('listProducts', products)
        })

        socketClient.on('deleteProduct', async (productId) => {
            await ProductsController.deleteById(productId)
            // ProductManager.deleteById(productId);
            let products = await ProductsController.get();
            io.emit('listProducts', products)
        })

        socketClient.on('updateProduct', async (product) => {
            // await ProductManager.updateById(product._id, product)
            // let products = await ProductManager.get();
            await ProductsController.updateById(product._id, product)
            let products = await ProductsController.get();
            io.emit('listProducts', products)
        })

        socketClient.on('createCart', async (newCart) => {
            await CartController.create(newCart);
            let carts = await CartController.get()
            io.emit('listCarts', carts)
        })

        socketClient.on('addProductToCart', async (product) => {
            // console.log(product)
            try {
                let findedProduct = await ProductsController.getById(product._id)
                // console.log("findedProduct", findedProduct);
                if (findedProduct) {
                    await CartController.addProductToCart(product.cartId, findedProduct._id, product.quantity)
                    let carts = await CartController.get()
                    io.emit('listCarts', carts)
                } else {
                    console.log('Product not found')
                }
            }
            catch (error) {
                console.log('error: ', error.message)
            }
            // console.log(findedProduct);
        })

        socketClient.on('removeProductFromCart', async (cid, pid) => {
            await CartController.removeProductFromCart(cid, pid);
            // io.emit('listCarts', cid)
            // let carts = await CartController.get()
            // io.emit('listCarts', carts)
        })

        socketClient.on('deleteCart', async (cartId) => {
            await CartController.deleteById(cartId);
            let carts = await CartController.get()
            io.emit('listCarts', carts)
        })

        socketClient.on('cartPurchase', async (cartId) => {
            await CartController.createPurchase(cartId)
            let carts = await CartController.get()
            io.emit('listCarts', carts)
        })

        socketClient.on('deleteUser', async (uid) => {
            await UsersController.deleteById(uid);
            let users = await UsersController.get();
            io.emit('listUsers', users)
        })


        let users = await UsersController.get();
        socketClient.emit('listUsers', users)


        socketClient.on('cambiarRol', async ({ usersId, nuevoRol }) => {
            try {
                const user = await UsersController.getById(usersId);

                await UsersController.updateById(user.id, { rol: nuevoRol })
            } catch (error) {
                console.log("Error", error.message)
            }

        })
        socketClient.on('disconnect', () => {
            console.log(`Se ha desconectado el cliente con id ${socketClient.id}`)
        })
    })
    console.log('Server socket running 🚀');

}

export const emitFromApi = (event, data) => io.emit(event, data);
