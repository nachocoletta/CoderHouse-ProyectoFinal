import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true }
})
const cartSchema = new mongoose.Schema({
    products: { type: [productSchema], default: [] }
}, { timestamps: true });

cartSchema.pre('find', function () {
    this.populate('products.productId')
}).pre('findOne', function () {
    this.populate('products.productId')
})

export default mongoose.model('Cart', cartSchema);