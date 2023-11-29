import mongoose from 'mongoose'
const { Schema } = mongoose

const productSchema = new Schema(
    {
        name: {
            type: String,
            trim: true,
            required: true,
            maxLength: 160,
        },
        slug: {
            type: String,
            lowercase: true,
        },
        description: {
            type: String,
            required: true,
            maxLength: 2000,
        },
        price: {
            type: Number,
            trim: true,
            required: true,
        },
        category: {
            type: Schema.ObjectId,
            ref: 'Category',
            required: true,
        },
        quantity: {
            type: Number,
        },
        sold: {
            type: Number,
            default: 0,
        },
        photo: {
            data: Buffer,
            contentType: String,
        },
        shipping: {
            required: false,
            type: Boolean,
        }
    }, {
        timestamps: true
    }
)

export default mongoose.model('Product', productSchema)