// ! Chekc role ("admin","Owner")

const checkRole = (...roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.user.role)){
            return res.status(403).json({message:"Your role is forbidden"}); // error forbidden
        }
        next();
    }
}

module.exports = checkRole