const User = require('../models/User')
const jwt = require('jsonwebtoken')

const auth = async (req, res, next) => {
    try {
        
        // console.log(req)
        // console.log(req.header("Authorization"))

        if(!req.header("Authorization")){
            throw new Error("Authorization required!")
        }

        const token = await req.header("Authorization").replace("Bearer","")
        const decoded = jwt.verify(token,"Booking")
        const user = await User.findOne({
            _id : decoded._id,
            "tokens.token" : token,
        })

        if(!user){
            throw new Error("Invalid Token")
        }

        req.user = user;
        req.user.token = token;
        next()

    } catch (error) {
        res.status(500).json({message:error.message})
    }
}

module.exports = auth