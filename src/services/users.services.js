// import UserDao from "../dao/user.dao.js";
// import UserDTO from "../dto/user.dto.js";
import { userRepository } from '../repositories/index.js'
import CartsService from './carts.services.js';

import EmailService from "./email.services.js";

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

    static async deleteByInactivity(uid) {

        // userRepository.deleteById(uid);
        const emailService = EmailService.getInstance();

        const user = await UsersService.findById(uid);
        // console.log("user in deletebyInactivity", user)
        // sendEmail(to, subject, html, attachments = []) {
        //     return this.transport.sendMail({
        //         from: config.mail.user,
        //         to,
        //         subject,
        //         html,
        //         attachments,
        //     });
        await emailService.sendEmail(
            user.email,
            'Usuario eliminado por inactividad',
            `Estimado ${user.firstName} ${user.lastName} su usuario ha sido eliminado de nuestra base de datos por inactividad.
            Le recordamos que luego de 2 dias sin conectarse es eliminado`
        )

        await CartsService.deleteById(user.cartId);

        await UsersService.deleteById(user.id);
    }
}