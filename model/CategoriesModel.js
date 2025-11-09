const mongoose = require('mongoose');
const categorySchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'A category must have a title'],
            unique: true,
            trim: true,
            maxLength: [
                100,
                'A category title must have less or equal than 100 characters',
            ],
            minLength: [
                3,
                'A category title must have more or equal than 3 characters',
            ],
        },

        desc: {
            type: String,
            required: [true, 'A category must have a description'],
            trim: true,
        },
        secretCategory: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);
categorySchema.pre(/^find/, function (next) {
    this.find({ secretCategory: { $ne: true } });
    this.start = Date.now();
    next();
});

const Category = mongoose.model('Category', categorySchema);
module.exports = Category;