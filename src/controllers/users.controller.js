import { createHash } from "../helpers/utils.js";
import UsersService from "../services/users.services.js";
// aqui va la logica de negocio

export default class UsersController {
    static async get(query = {}) {
        const users = await UsersService.findAll(query)
        return users
    }

    static async create(data) {
        // console.log("data", data)
        const user = await UsersService.create(data)
        return user;
    }

    static async getById(uid) {
        const user = await UsersService.findById(uid)
        if (!user) {
            throw new Error(`Id de usuario no encontrado ${uid}`)
        }
        return user
    }

    static async getByMail(email) {
        const users = await UsersService.findAll({ email })
        // if (!users.length) {
        //     throw new Error(`Correo o password invalidos`)
        // }
        // console.log("Users", users)
        return users[0];
    }

    static async updateById(uid, data) {
        await UsersController.getById(uid)
        console.log("Actualizando el usuario")
        await UsersService.updateById(uid, data)
        console.log("Usuario actualizado correctamente")
    }

    static async updatePassword(email, newPassword) {
        console.log("Actualizando clave del usuario");

        const users = await UsersController.get({ email })


        if (!users.length) {
            throw new Error(`El mail proporcionado no existe en la DB`)
        }
        await UsersService.updateById(users[0]._id, { password: createHash(newPassword) })
        console.log("Clave correctamente actualizada")

    }

    static async updateDocument(uid, data) {
        await UsersService.updateDocument(uid, data)
    }

    static async deleteById(uid) {
        await UsersController.getById(uid)
        console.log("Eliminando el usuario")
        await UsersService.deleteById(uid)
        console.log("Usuario eliminado correctamente")
    }

    static async updateLastConnection(uid, last_connection) {
        // let user = await UsersController.getById(uid);

        await UsersService.updateById(uid, last_connection)
    }
}