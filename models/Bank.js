const mongoose = require('mongoose');

const bankSchema = new mongoose.Schema({

    bankName: {
        type:String,
        trim:true,
        required:[true,"please input your BANK name!"]
    },
    accountNumber: {
        type:String,
        required:[true,"please input your account number!"]
    },
    accountHolder: {
        type:String,
        required:[true,"please input your account holder!"]
    },
    imageUrl: {
        type:String,
        required:true
    },

})

module.exports = mongoose.model('Bank',bankSchema)