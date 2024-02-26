import TicketDao from "../dao/ticket.dao.js";

export default class TicketsService {
    static findAll(filter = {}, options = {}) {
        return TicketDao.get(filter, options)
    }

    static async create(payload) {
        console.log('Creando Ticket');
        const ticket = await TicketDao.create(payload)
        console.log(`Ticket creado correctamente (${ticket._id})`);
        return ticket;
    }

    static findById(tid) {
        return TicketDao.getById(tid)
    }

    static updateById(tid, payload) {
        return TicketDao.updateById(tid, payload)
    }

    static deleteById(tid) {
        return TicketDao.deleteById(tid)
    }
}