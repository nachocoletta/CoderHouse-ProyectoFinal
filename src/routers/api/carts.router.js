import { Router } from "express";
import CartManager from "../../dao/CartManager.js";
import CartController from "../../controllers/cart.controller.js"
import { authMiddleware, authorizationMiddleware } from "../../helpers/utils.js";
import UsersService from "../../services/users.services.js";
import CartsService from "../../services/carts.services.js";
import ProductsService from "../../services/products.service.js";
import passport from "passport";
import mongoose from "mongoose";
const router = Router();

router.get('/',
    async (req, res) => {
        const carts = await CartController.get();
        res.status(200).json(carts);
    });

router.get('/:cid',
    async (req, res) => {
        try {
            const { cid } = req.params;
            const cart = await CartController.getById(cid);
            res.status(200).json(cart)
        } catch (error) {
            res.status(error.statusCode || 500).json({ message: error.message })
        }
    })

router.post('/:cid',
    // authMiddleware('jwt'),
    passport.authenticate('jwt', { session: false }),
    authorizationMiddleware(['user', 'premium']),
    async (req, res) => {
        try {
            // console.log("req.user", req.user)
            // console.log('addproducttocart')

            const { cid } = req.params
            const { productId, quantity } = req.body;

            if (req.user.rol === 'premium') {
                const product = await ProductsService.findById(productId);
                const uid = new mongoose.Types.ObjectId(req.user.id);
                if (product.owner == uid) {

                    // }
                    // if (product.owner.equals(uid)) {
                    return res.status(400).json({ error: 'No se puede agregar un producto al carrito del cual se es propietario.' })
                }
            }

            const product = await CartController.addProductToCart(cid, productId, quantity)
            res.status(201).json(product)
        } catch (error) {
            console.error(error.message)
            res.status(error.statusCode || 500).json({ message: error.message })
        }
    })

// router.post('/',
//     authMiddleware('jwt'),
//     async (req, res, next) => {
//         console.log("req.user", req.user)
//         try {
//             const cart = await CartController.create();
//             res.status(201).json(cart);
//         } catch (error) {
//             console.error("Error al crear el carrito", error)
//             // res.status(error.statusCode || 500).json({ message: error.message })
//             next(error)
//         }
//     });



// router.delete('/:cid', async (req, res) => {
//     const { cid } = req.params;

//     try {
//         await CartManager.deleteById(cid);
//         res.status(204).end();
//     } catch (error) {
//         res.status(error.statusCode || 500).json({ message: error.message })
//     }
// })

router.delete('/:cid/products/:pid',
    async (req, res, next) => {
        const { cid, pid } = req.params

        // console.log('entra a la ruta')
        try {
            const cart = await CartController.removeProductFromCart(cid, pid)
            res.status(200).send(cart)
        } catch (error) {
            next(error)
            // res.status(error.statusCode || 500).json({ message: error.message })
        }
    })

router.delete('/:cid',
    async (req, res) => {
        const { cid } = req.params;
        // console.log('entra');
        try {
            const cart = await CartController.removeAllProductsFromCart(cid)
            res.status(201).send(cart)
        } catch (error) {
            res.status(error.statusCode || 500).json({ message: error.message })
        }
    })

router.put('/:cid',
    async (req, res) => {
        const { cid } = req.params;
        const products = req.body;
        // console.log("products en la ruta", products);
        // return res.status(200).json(products)
        try {
            const cart = await CartController.updateProductsFromCart(cid, products)
            res.status(201).send(cart)
        } catch (error) {
            res.status(error.statusCode || 500).json({ message: error.message })
        }
    })

router.put('/:cid/products/:pid',
    async (req, res) => {
        const { cid, pid } = req.params;
        const { quantity } = req.body;

        try {
            const cart = await CartManager.updateProductQuantityFromCart(cid, pid, quantity)
            res.status(200).send(cart)
        } catch (error) {
            res.status(error.statusCode || 500).json({ message: error.message })
        }

    })

router.post('/:cid/purchase',
    async (req, res, next) => {
        const { cid } = req.params;

        try {
            const { user, productsWithoutStock, cart, ticket } = await CartController.createPurchase(cid)


            // console.log("updatedProducts", updatedProducts)
            res.status(200).json({
                user,
                productsWithoutStock,
                cart,
                ticket
            })
        } catch (error) {
            console.error("Error", error.message);
            next(error);
        }

    })


export default router;