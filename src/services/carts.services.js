import CartDao from "../dao/cart.dao.js";

import { Exception } from "../helpers/utils.js";

export default class CartsService {

    static findAll(filter = {}) {
        return CartDao.getAll(filter)
    }

    static async create(payload) {
        console.log("Creando un carrito")
        const cart = await CartDao.create(payload);
        console.log(`Carrito creado correctamente ${cart._id}`)
        return cart;
    }

    static findById(cid) {
        return CartDao.getById(cid)
    }

    static updateById(cid, payload) {
        return CartDao.updateById(cid, payload)
    }

    static deleteById(cid) {
        return CartDao.deleteById(cid)
    }




}