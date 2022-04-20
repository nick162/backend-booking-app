const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema;


const itemSchema = new mongoose.Schema({

    itemName: {
        type:String,
        required:[true,"Please input your item name!"]
    },
    itemPrice: {
        type:Number,
        required:[true,"Please input your item pric!e"]
    },
    unit: {
        type:String,
        required:[true,"Please input your item unit!"]
    },
    sumBooked: {
        type:Number,
        default:0
    },
    location: {
        type:String,
        required:[true,"please input your item location"]
    },
    isPopular: {
        type:Boolean,
        default:false
    },
    description: {
        type:String,
        required:[true,"Please input your item description!"]
    },

    category: {
        type:ObjectId,
        ref:'Category'
    },
    image : [{
        type:ObjectId,
        ref:'Image'
    }],
    feature: [{
        type:ObjectId,
        ref:'Feature'
    }],
    info:[{
        type:ObjectId,
        ref:'Info'
    }]

})

module.exports = mongoose.model('Item',itemSchema)