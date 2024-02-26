
import { getNewId, getJSONFromFile, saveJSONToFile } from '../helpers/utils.js'


export class ProductManagerFs {
    constructor(path) {
        this.path = path;
    }
    async addProduct({ title, description, code, price, status, stock, category, thumbnails }) {
        // console.log('entra a la ruta')
        if (!(title && description && price && thumbnails && code && stock)) {
            throw new Error(`Some data is missing, please check your input`);
            // console.log(`Some data is missing, please check your input`);
            // return;
        }
        try {
            const products = await getJSONFromFile(this.path);

            let findedCode = products.find((product) => product.code === code);
            // console.log("findedCode", findedCode)
            if (!findedCode) {
                let newProduct = {
                    id: getNewId(),
                    title,
                    description,
                    code,
                    price,
                    status,
                    stock,
                    category,
                    thumbnails
                }
                products.push(newProduct);
                await saveJSONToFile(this.path, products);
                return newProduct;
            } else {
                let error = `The code '${findedCode.code}' already exists`
                // throw new Error('Error...')
                // console.log(error)
                return error;
            }
        } catch (error) {
            // console.log(`The code ${findedCode.code} already exists`);
            throw new Error(`Something is wrong ${error.message}`);
        }
    }

    async getProducts() {
        return getJSONFromFile(this.path);
    }

    async getProductById(id) {
        const products = await getJSONFromFile(this.path);
        const findedProduct = products.find((product) => product.id === id);

        return findedProduct
            ? findedProduct
            : `Product with id ${id} doesn't exists`;
    }

    async updateProduct({
        id,
        title,
        description,
        code,
        price,
        status,
        stock,
        category,
        thumbnails,
    }) {
        if (!id) {
            // console.log(`You must provide an ID`);
            throw new Error(`You must provide an ID`);
        }

        // si el codigo que quiere actualizar ya existe en el archivo
        const products = await getJSONFromFile(this.path);
        let findedCode = products.find(
            (product) => product.code === code && product.id !== id
        );

        if (findedCode) {
            throw new Error(
                `Provided code ${findedCode.code} already exists, can't update`
            );
        }

        let product = await this.getProductById(id);
        if (typeof product !== "string") {
            // si devuelve un string es porque no encontro el producto
            product.title = title || product.title;
            product.description = description || product.description;
            product.price = price || product.price;
            product.code = code || product.code;
            product.status = status !== undefined ? status : product.status;
            // product.status = status || product.status;
            product.stock = stock || product.stock;
            product.category = category || product.category;
            product.thumbnails = thumbnails || product.thumbnails;

            const data = await getJSONFromFile(this.path);
            const productIndex = data.findIndex((product) => product.id === id);
            data[productIndex] = product;
            await saveJSONToFile(this.path, data);
        } else {
            console.log("no entra");
        }
    }

    async deleteProduct(id) {
        if (!id) {
            // console.log(`You must provide an ID`);
            throw new Error(`You must provide an ID`);
        }

        let product = await this.getProductById(id);

        if (typeof product !== "string") {
            let products = await getJSONFromFile(this.path);
            products = products.filter((pro) => pro.id !== id);
            saveJSONToFile(this.path, products);
            console.log(`Product with id ${id} was deleted`);
            return products;
        } else {
            console.log(`Product with id ${id} doesn't exists`);
            // throw new Error(`Product with id ${id} doesn't exists`);
        }
    }
}