const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema;

const featureSchema = new mongoose.Schema({

    featureName:{
        type:String,
        unique:true,
        required:[true," Please input feature name!"]
    },
    qty: {
        type:Number,
        required:[true,"Please input your feature qty!"]
    },
    imageUrl: {
        type:String,
        required:true
    },

    item :[{
        type:ObjectId,
        ref:'Item'
    }]
})

module.exports = mongoose.model('Feature',featureSchema)