import { Router } from "express";
import ProductManager from "../../dao/ProductManager.js";
// import productModel from "../../models/product.model.js";
// import 'dotenv/config';
import { uploader } from "../../helpers/utils.js";
import passport from "passport";
import config from "../../config.js";
import ProductsController from "../../controllers/products.controller.js";
import { authorizationMiddleware } from "../../helpers/utils.js";
import { CustomError } from "../../helpers/CustomError.js";
import EnumsError from "../../helpers/EnumsError.js";
import { generatorProductError } from "../../helpers/CauseMessageError.js";
import mongoose from "mongoose";
const router = Router();


const buildResponse = (data) => {
    return {
        status: "success",
        payload: data.docs.map(product => product.toJSON()),
        totalPages: data.totalPages,
        prevPage: data.prevPage,
        nextPage: data.nextPage,
        page: data.page,
        hasPrevPage: data.hasPrevPage,
        hasNextPage: data.hasNextPage,
        prevLink: data.hasPrevPage ? `http://localhost:${config.port}/products?limit=${data.limit}&page=${data.prevPage}` : '',
        nextLink: data.hasNextPage ? `http://localhost:${config.port}/products?limit=${data.limit}&page=${data.nextPage}` : '',
    }
}

router.get('/',
    passport.authenticate('jwt', { session: false }),
    authorizationMiddleware(['user', 'admin', 'premium']),
    async (req, res, next) => {
        try {
            const { page = 1, limit = 10, category, sort } = req.query;
            const options = {
                page,
                limit,
                sort: { price: sort || 'asc' }
            }
            // const options = { page, limit }
            const criteria = {};

            // console.log("entro aqui")
            if (category) {
                console.log("query", category)
                criteria.category = category;
            }
            const result = await ProductsController.get(criteria, options)

            res.status(200).json(result);

        } catch (error) {
            console.error(error.message)
            next(error);
        }
    })

// router.get('/', async (req, res) => {
//     const products = await ProductManager.get()
//     res.status(200).json(products);
// })

router.get('/:pid',
    async (req, res) => {
        try {
            const { pid } = req.params;

            const product = await ProductsController.getById(pid);
            res.status(200).json(product);
        } catch (error) {
            res.status(error.statusCode || 500).json({ message: error.message })
        }
    })

router.post('/mockingproducts',
    passport.authenticate('jwt', { session: false }),
    authorizationMiddleware('admin'),
    async (req, res, next) => {
        const PRODUCTS_QUANTITY = 5
        try {
            await ProductsController.createFakeProduct(PRODUCTS_QUANTITY)
            return res.status(200).json({ message: "Productos creados" })
            // res.redirect('/products')
        } catch (error) {
            console.error("Error: ", error.message)
            next(error);
        }
    })

router.post('/',
    passport.authenticate('jwt', { session: false }),
    authorizationMiddleware(['admin', 'premium']),
    uploader.array('thumbnails', 4),
    async (req, res, next) => {
        let { body } = req;
        const { files } = req;
        // console.log('body', body);
        // console.log('Files:', req.files);
        const { title, description, code, price, stock, category } = req.body;
        console.log("req.user en post products", req.user)
        try {
            if (!title || !description || !code || !price || !stock || !category) {
                // console.log("title", title)
                CustomError.createError({
                    name: 'Error creando el producto',
                    cause: generatorProductError({
                        title, description, code, price, stock, category
                    }),
                    message: 'Ocurrio un error mientras intentamos crear un producto.',
                    code: EnumsError.BAD_REQUEST_ERROR,
                })
            }

            if (req.user.rol !== 'admin') {
                const ownerId = req.user.id instanceof mongoose.Types.ObjectId
                    ? req.user.id
                    : new mongoose.Types.ObjectId(req.user.id);

                body.owner = ownerId;
                // console.log("body", body)
                const product = await ProductsController.create(
                    body,
                    files);
                // res.redirect(`/products`)
                return res.status(201).json(product);
            }
            const product = await ProductsController.create(
                body,
                files);
            res.status(201).json(product);
        } catch (error) {
            next(error)
        }

    });

router.put('/:pid',
    passport.authenticate('jwt', { session: false }),
    authorizationMiddleware(['admin', 'premium']),
    async (req, res) => {
        const { pid } = req.params;
        const { body } = req
        try {
            const uid = new mongoose.Types.ObjectId(req.user.id);

            if (req.user.rol === 'premium') {
                const product = await ProductManager.getById(pid);
                // console.log(product.owner);
                // console.log(uid)

                if (!product.owner.equals(uid)) {
                    return res.status(400).json({ error: `No se puede modificar un producto del cual no se es propietario.` })
                }
            }
            await ProductManager.updateById(pid, body)
            res.status(204).end();
        } catch (error) {
            res.status(error.statusCode || 500).json({ message: error.message })
        }
    })

router.delete('/:pid',
    passport.authenticate('jwt', { session: false }),
    authorizationMiddleware(['admin', 'premium']),
    async (req, res, next) => {
        try {
            const { pid } = req.params;

            const uid = new mongoose.Types.ObjectId(req.user.id);

            if (req.user.rol === 'premium') {
                const product = await ProductsController.getById(pid);
                // console.log(product.owner);
                // console.log(uid)

                if (!product.owner.equals(uid)) {
                    return res.status(400).json({ error: `No se puede borrar un producto del cual no se es propietario` })
                }
                await ProductsController.deleteById(pid);
                return res.status(204).end();
            }
            // console.log('pasa por aca')
            await ProductsController.deleteById(pid);

            res.status(204).end();
        } catch (error) {
            console.log(error.message)
            next(error)
            // res.status(error.statusCode || 500).json({ message: error.message })
        }
    })



export default router;