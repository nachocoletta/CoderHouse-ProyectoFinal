import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({
    code: { type: String, unique: true },
    purchase_datetime: { type: Date },
    amount: { type: Number },
    purchaser: { type: String }
}, { timestamps: true })

export default mongoose.model('Ticket', ticketSchema)