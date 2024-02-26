// import UserDao from "../dao/user.dao.js";
// import UserDTO from "../dto/user.dto.js";
import { userRepository } from '../repositories/index.js'

export default class UsersService {

    static findAll(filter = {}) {
        return userRepository.get(filter)
    }

    // static async findAll(filter = {}) {
    //     const users = await UserDao.get(filter);
    //     return users.map(user => new UserDTO(user))
    // }
    static async create(payload) {
        console.log("Creando un nuevo usuario");
        const user = await userRepository.create(payload)
        // const user = await UserDao.create(payload);
        console.log(`Usuario creado correctamente (${user._id})`)
        return user;
    }

    static async findById(uid) {
        return userRepository.getCurrent(uid)
    }
    // static async findById(uid) {
    //     const user = await UserDao.getById(uid)

    //     return UserDao.getById(uid)
    // }

    static updateById(uid, payload) {
        return userRepository.updateById(uid, payload);
    }

    static async updateDocument(uid, payload) {
        // console.log("payload", payload)
        // return await UserDao.updateDocuments(uid, payload)
        return await userRepository.updateDocument(uid, payload)
    }

    static deleteById(uid) {
        return userRepository.deleteById(uid)
    }
}