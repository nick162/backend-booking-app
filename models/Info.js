const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema;

const infoSchema = new mongoose.Schema({

    infoName:{
        type:String,
        require:[true," Please input info name!"]
    },

    type: {
        type:String,
        enum:["Testimoni","NearBy"],
        required:[true,"Please input your info type!"]
    },

    isHighlight: {
        type:Boolean,
        default:false
    },

    description: {
        type:String,
        required:[true,"Please input your info description!"]
    },
    

    imageUrl: {
        type:String,
        required:true
    },
    
    item :[{
        type:ObjectId,
        ref:"Item"
    }]
})

module.exports = mongoose.model('Info',infoSchema)