// import ProductDao from "../dao/product.dao.js";

import { ProductDao } from "../dao/factory.js";

import EmailService from "./email.services.js";
import UsersService from "./users.services.js";

export default class ProductsService {

    static findAll(filter = {}, options) {
        return ProductDao.get(filter, options)
        // return ProductDao.get(filter, options)
    }

    static async create(payload) {
        console.log('creando producto');
        // console.log("payload en service", payload);
        const product = await ProductDao.create(payload)
        // const product = await ProductDao.create(payload);

        console.log(`Producto creado correctamente (${product._id})`)
        return product;
    }

    static findById(pid) {
        return ProductDao.getById(pid)
    }

    static updateById(pid, payload) {
        return ProductDao.updateById(pid, payload)
    }

    static async deleteById(pid) {


        const product = await ProductsService.findById(pid);
        // console.log("product", product.owner);
        const user = await UsersService.findById(product.owner.toString())
        // console.log("user", user)
        if (user.rol === 'premium') {
            const emailService = EmailService.getInstance();

            await emailService.sendEmail(
                user.email,
                'Producto eliminado',
                `Estimado ${user.firstName} ${user.lastName} su producto ${product.title} ha sido eliminado de nuestra base de datos.`
            )
            return ProductDao.deleteById(pid)
        }
        return ProductDao.deleteById(pid)
    }
}