import mongoose from 'mongoose';
import moment from 'moment-timezone';

const roles = ['user', 'admin', 'premium'];
export const documentTypes = ['Id', 'address', 'accountStatus']
const userSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: { type: String, unique: true },
    age: Number,
    password: String,
    cartId: { type: mongoose.Schema.Types.ObjectId, ref: 'Cart' },
    rol: { type: String, enum: roles, default: "user" },
    provider: String,
    documents: {
        type: [{
            name: {
                type: String
            },
            reference: {
                type: String
            },
            documentType: {
                type: String, enum: documentTypes
            }
        }]
    },
    last_connection: {
        type: Date
    }

}, { timestamps: true });

userSchema.pre('findOneAndUpdate', function (next) {
    const allowedDocumentTypes = ['Id', 'address', 'accountStatus'];
    const documentType = this.getUpdate().$push.documents.type.documentType;

    if (!allowedDocumentTypes.includes(documentType)) {
        const error = new Error(`Invalid documentType: ${documentType}`);
        return next(error);
    }

    next();
});

export default mongoose.model('User', userSchema);
// userSchema.pre('find', function () {
//     this.populate('cart.products.productId')
// }).pre('findOne', function () {
//     this.populate('cart.products.productId')
// });

