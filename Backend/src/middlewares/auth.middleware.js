const jwt = require("jsonwebtoken")

function authMiddleware(req, res, next){

    try {

        let token

        // token from header
        if(req.headers.authorization){
            token = req.headers.authorization.split(" ")[1]
        }

        // token from cookie
        if(!token && req.cookies){
            token = req.cookies.token
        }

        if(!token){
            return res.status(401).json({
                success:false,
                message:"No token provided"
            })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        req.user = decoded

        next()

    } catch (error) {

        return res.status(401).json({
            success:false,
            message:"Invalid token"
        })
    }
}

module.exports = {
    authMiddleware
}