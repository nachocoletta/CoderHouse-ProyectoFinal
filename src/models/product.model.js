import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const productSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    price: { type: Number, required: true },
    status: { type: Boolean, default: true },
    stock: { type: Number, required: true },
    category: { type: String, required: true },
    thumbnails: { type: [String], default: [] },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        //  default: new mongoose.Types.ObjectId('6591bd964c892e7ada705733')
    }
}, { timestamps: true });

productSchema.plugin(mongoosePaginate)

export default mongoose.model('Product', productSchema);