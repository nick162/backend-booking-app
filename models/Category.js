const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema;

const categorySchema = new mongoose.Schema({

    categoryName: {
        type:String,
        unique:true,
        require:[true," Please input category name!"]
    },

    item : [{
        type:ObjectId,
        ref:'Item'
    }]
})

module.exports = mongoose.model('Category',categorySchema)