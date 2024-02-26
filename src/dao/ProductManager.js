import ProductModel from '../models/product.model.js';
import { Exception } from '../helpers/utils.js';
// import aggregatePaginate from 'mongoose-aggregate-paginate-v2';
export default class ProductManager {
    static async get(criteria = {}, options = {}) {
        // // console.log('query', query)
        // const { page = 1, limit = 20, sort } = options;
        // const options = { page, limit, sort }
        // // const criteria = {};
        // console.log("criteria", criteria)
        // return await ProductModel.paginate(criteria, options)
        // return await ProductModel.find(criteria);
        try {
            // console.log('entra');
            // const result = await ProductModel.find()
            const result = await ProductModel.paginate(criteria, options);
            // console.log("result", result);
            return result;
        } catch (error) {
            throw new Error(`Error al obtener productos: ${error.message}`);
        }
    }

    static async getById(pid) {
        const product = await ProductModel.findById(pid);
        // console.log("product", product)
        if (!product) {
            throw new Exception("No existe el producto", 404)
        }
        return product;
    }
    static async create(data, files) {
        // console.log("data", data);
        // console.log("files", files)
        try {
            const { title, description, code, price, stock, category } = data;
            const product = await ProductModel.create({
                title, description, code, price, stock, category,
                thumbnails: files.map(file => file.filename)
            });
            req.logger.info(`Producto creado exitosamente ${product}`);
            return product;
        } catch (error) {
            console.log(`Error: ${error.message}`);
            throw new Exception(`Ha ocurrido un error en el servidor`, 500)
        }
    }
    // static async create(data, files) {
    //     try {
    //         const { title, description, code, price, stock, category } = data;
    //         const thumbnails = files.map(file => `./productImages/${file.originalname}`);
    //         const product = await ProductModel.create({
    //             title, description, code, price, stock, category, thumbnails
    //         });
    //         console.log(`Producto creado exitosamente ${product}`);
    //         return product;
    //     } catch (error) {
    //         console.log(`Error: ${error.message}`);
    //         throw new Exception(`Ha ocurrido un error en el servidor`, 500)
    //     }
    // }


    static async updateById(pid, data) {
        // console.log(`id ${pid} data ${data}`)
        const product = await ProductModel.findById(pid);
        if (!product) {
            throw new Exception('No existe el producto', 404);
        }
        const criteria = { _id: pid };
        const operation = { $set: data };
        await ProductModel.updateOne(criteria, operation);
        console.log('Producto actualizado correctamente')
    }

    static async deleteById(pid) {
        const product = await ProductModel.findById(pid);
        if (!product) {
            throw new Exception('No existe el producto', 404);
        }
        const criteria = { _id: pid };
        await ProductModel.deleteOne(criteria);
        console.log('Producto eliminado correctamente')
    }
}