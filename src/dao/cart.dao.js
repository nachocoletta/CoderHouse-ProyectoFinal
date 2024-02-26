import CartModel from "../models/cart.model.js";
// import CartController from "../controllers/cart.controller.js";
export default class CartDao {

    static async getAll() {
        return await CartModel.find();
    }

    static async create(data = {}) {
        return await CartModel.create(data)
    }

    static async getById(cid) {
        return await CartModel.findById(cid);
    }

    static async updateById(cid, products) {
        return await CartModel.findOneAndUpdate({ _id: cid }, { $set: { products } }, { new: true });

    }


    static async deleteById(cid) {
        return await CartModel.deleteOne({ _id: cid })
    }

}