import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        items: [
            {
                id: String,
                name: String,
                price: Number,
                quantity: Number,
            },
        ],
        total: {
            type: Number,
            required: true,
        },
        deliveryAddress: {
            fullName: String,
            email: String,
            street: String,
            postalCode: String,
            city: String,
        },
    },
    {
        timestamps: true,
    }
);

const Order = mongoose.model('Order', orderSchema);

export default Order;
