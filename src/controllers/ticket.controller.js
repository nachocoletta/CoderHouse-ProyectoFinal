import TicketsService from "../services/tickets.services.js";

export default class TicketController {
    static async get(filter, options) {
        const tickets = await TicketsService.findAll(filter, options)
        return tickets
    }

    static async create(data = {}) {
        const ticket = await TicketsService.create(data)
        return ticket;
    }

    static async getById(tid) {
        return await TicketsService.findById(tid)
    }

    static async deleteById(tid) {
        console.log("Eliminando ticket")
        await TicketsService.deleteById(tid)
        console.log(`Ticket con id ${tid} eliminado correctamente`)
    }
}