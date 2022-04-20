const mongoose = require('mongoose');
const validator = require('validator');

const customerSchema = new mongoose.Schema({

    firstName: {
        type:String,
        trim:true,
        required:[true,"Please input your first name!"]
    },
    lastName: {
        type:String,
        trim:true,
        required:[true,"Please input your last name!"]
    },
    email: {
        type:String,
        lowercase:true,
        required:[true,"Please input your email address!"],
        validate(value){
            if(!validator.isEmail(value)){
                throw error("please input a valid email address!")
            }
        }
    },
    phoneNumber: {
        type:String,
        required:[true,"Please input your phone number!"],
    },

})

module.exports = mongoose.model('Customer',customerSchema)