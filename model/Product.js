const mongoose = require('mongoose');
const Category = require('./CategoriesModel');
const productSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'A product must have a title'],
            trim: true,
            unique: [true, 'A product must have a unique title'],
            maxLength: [
                100,
                'A product title must have less or equal than 100 characters',
            ],
            minLength: [
                3,
                'A product title must have more or equal than 3 characters',
            ],
        },

        images: {
            type: [
                {
                    url: {
                        type: String,
                        required: [true, 'Image URL is required'],
                    },
                    public_id: {
                        type: String,
                        required: [true, 'Image public_id is required'],
                    },
                    _id: false,
                },
            ],
            validate: [
                (val) => val.length >= 1,
                'A product must have at least one image',
            ],
        },

        desc: {
            type: String,
            required: [true, 'A product must have a description'],
            trim: true,
        },

        price: {
            type: Number,
            required: [true, 'A product must have a price'],
            min: [0, 'Price must be above 0'],
        },
        ratings: {
            type: Number,
            required: [true, 'A product must have ratings'],
        },

        category: {
            type: String,
            required: [true, 'A product must have a category'],
            validate: {
                validator: async function (value) {
                    const categoryExists = await Category.exists({ title: value });
                    return categoryExists;
                },
                message:
                    'Category must be one of the existing categories in the database',
            },
        },

        brand: {
            type: String,
            required: [true, 'A product must have a brand'],
            trim: true,
        },
        secretProduct: { type: Boolean, default: false },
    },
    {
        timestamps: true,
    }
);

productSchema.pre(/^find/, function (next) {
    this.find({ secretProduct: { $ne: true } });
    this.start = Date.now();
    next();
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;