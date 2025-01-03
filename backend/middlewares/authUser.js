import jwt from "jsonwebtoken"

// admin authentication middleware
const authUser = async (req, res, next) => {
    try {
        
        // getting token from headers
        const {token} = req.headers
        if (!token) {
            return res.json({success: false, message: "Not Authorized, Login Again"})
        }
        // if the token is present, verify it by decoding the token
        const token_decode = jwt.verify(token, process.env.JWT_SECRET)

        // we'll get user id from the token & get added in req.body 
        req.body.userId = token_decode.id

        next()


    } catch (error) {
        console.log(error)
        res.json({success: false, message: error.message})
        
    }
}

export default authUser