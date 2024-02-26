import MessageDao from "../dao/message.dao.js";

export default class MessagesService {
    static findAll(filter = {}) {
        return MessageDao.get(filter)
    }

    static async create(payload) {
        const message = await MessageDao.create(payload)

        return message;
    }
}