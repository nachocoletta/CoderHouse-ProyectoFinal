import UserModel from "../models/user.model.js";
import { Exception, createHash } from '../helpers/utils.js';

export default class UserManager {
    static async get(query = {}) {
        const criteria = {};
        const result = await UserModel.find(query)
        // console.log("result", result);
        return result
    }

    static async getByMail(email) {

        const result = await UserModel.findOne({ email })
        // console.log("result", result)
        return result
    }
    static async getById(uid) {
        try {
            const user = await UserModel.findById(uid);

            // console.log("user", user);
            if (!user) {
                throw new Exception('No existe el usuario', 404)
            }
            return user;
        } catch (error) {
            console.error('Error al crear el usuario', error.message)
            // throw new Exception("No se pudo obtener el usuario ", 500);
        }
    }

    static async create(newUser = {}) {
        try {
            const user = await UserModel.create(newUser)
            return user;
        } catch (error) {
            console.error('Error al crear el usuario', error.message)
            throw new Exception("No se pudo crear el usuario ", 500);
        }
    }

    static async update(email, newPassword) {
        try {
            const updatedUser = await UserModel.updateOne({ email }, {
                $set: {
                    password: createHash(newPassword)
                }
            })
            return updatedUser
        } catch (error) {
            console.error('Error al actualizar el usuario', error.message)
            throw new Exception("No se pudo actualizar el usuario ", 500);
        }
    }
}