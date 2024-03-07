import TicketDao from "../dao/ticket.dao.js";
import EmailService from "./email.services.js";

export default class TicketsService {
    static findAll(filter = {}, options = {}) {
        return TicketDao.get(filter, options)
    }

    static async create(payload) {
        console.log('Creando Ticket');
        const ticket = await TicketDao.create(payload)
        console.log(`Ticket creado correctamente (${ticket._id})`);
        const emailService = EmailService.getInstance();
        console.log("payload", payload)
        await emailService.sendEmail(
            payload.purchaser,
            "Detalle de su compra",
            `Gracias por comprar en nuestra pagina, el total de su compra fue de $${payload.amount}`
        )
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