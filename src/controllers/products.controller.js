import ProductsService from "../services/products.service.js";
import { faker } from '@faker-js/faker';
import { getNewId } from '../helpers/utils.js'
// import { CustomError } from "../../helpers/CustomError.js";
// import EnumsError from "../../helpers/EnumsError.js";
// import { generatorProductError } from "../../helpers/CauseMessageError.js";

export default class ProductsController {
    static async get(query = {}, paginationOptions = {}) {
        const { page = 1, limit = 10, category, sort } = paginationOptions;

        const options = {
            page,
            limit,
            sort
        }

        const criteria = {};

        // console.log(limit)
        if (category) {
            // console.log("query", category)
            criteria.category = category;
        }
        // console.log('sort', sort)
        const products = await ProductsService.findAll(query, options)
        return products
    }

    static async create(data, files) {
        // console.log('entra al controlador');
        // console.log(data)
        try {
            const product = await ProductsService.create({ data, files })
            return product
        } catch (error) {
            console.error("Error", error.message)
        }
    }
    static async createFakeProduct(productsQuantity) {
        for (let i = 0; i < productsQuantity; i++) {
            let productCategory = faker.commerce.department();
            let productTitle = faker.commerce.productName();
            let productDescription = `${productTitle} - ${faker.lorem.words(5)}`;

            let newProduct = {
                title: productTitle,
                description: productDescription,
                code: getNewId(),
                price: faker.number.float({ min: 1, max: 1000000, precision: 0.01 }),
                status: true,
                stock: faker.number.int({ min: 0, max: 10000 }),
                category: productCategory,
            }
            // console.log(newProduct)
            await ProductsService.create({ data: newProduct })
        }
    }


    static async getById(pid) {
        const product = await ProductsService.findById(pid)
        if (!product) {
            throw new Error(`Id de producto no encontrado ${pid}`)
        }
        return product
    }

    static async updateById(pid, data) {
        await ProductsController.getById(pid)
        console.log('Actualizando el producto')
        await ProductsService.updateById(pid, data)
        console.log("Producto actualizado correctamente")
    }

    static async deleteById(pid) {
        await ProductsController.getById(pid)
        console.log("Eliminando producto...");
        await ProductsService.deleteById(pid)
        console.log("Producto eliminado correctamente");
    }


}