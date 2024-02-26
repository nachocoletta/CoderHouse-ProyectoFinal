import MessagesService from "../services/messages.services.js";

export default class MessageController {
    static async get(query = {}) {

        const messages = await MessagesService.findAll();

        return messages
    }

    static async create(data) {
        const message = await MessagesService.create(data)
        return message;
    }
}