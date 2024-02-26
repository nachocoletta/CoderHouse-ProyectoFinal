import TicketModel from "../models/ticket.model.js";

export default class TicketDao {

    static get(criteria = {}, options = {}) {
        return TicketModel.find(criteria, options)
    }

    static create(data) {
        return TicketModel.create(data)
    }

    static getById(tid) {
        return TicketModel.findById(tid)
    }

    static updateById(tid, data) {
        return TicketModel.updateOne({ _id: tid }, { $set: data })
    }

    static deleteById(tid) {
        return TicketModel.deleteOne({ _id: tid })
    }
}