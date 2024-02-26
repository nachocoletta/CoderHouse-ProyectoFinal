import MessageModel from "../models/message.model.js";

export default class MessageDao {

    static get(query = {}) {
        const criteria = {};
        return MessageModel.find(criteria)
    }

    static async create(data) {
        console.log("data", data);

        const message = await MessageModel.create(data);
        console.log(`Mensaje creado exitosamente`);
        return message;

    }
}