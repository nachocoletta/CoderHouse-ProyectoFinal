import MessageModel from '../models/message.model.js'
import { Exception } from '../helpers/utils.js';

export default class MessageManager {

    static async get(query = {}) {
        const criteria = {};
        return await MessageModel.find(criteria)
    }

    static async create(data) {
        console.log("data", data);
        try {
            const message = await MessageModel.create(data);
            console.log(`Mensaje creado exitosamente`);
            return message;
        } catch (error) {
            console.log(`Error: ${error.message}`);
            throw new Exception(`Ha ocurrido un error en el servidor`, 500)
        }
    }
}