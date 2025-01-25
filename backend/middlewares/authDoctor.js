import jwt from "jsonwebtoken"

// doctor authentication middleware
const authDoctor = async (req, res, next) => {
    try {
        
        // getting token from headers
        const {dtoken} = req.headers
        if (!dtoken) {
            return res.json({success: false, message: "Not Authorized, Login Again"})
        }
        // if the token is present, verify it by decoding the token
        const token_decode = jwt.verify(dtoken, process.env.JWT_SECRET)

        // we'll get user id from the token & get added in req.body 
        req.body.docId = token_decode.id

        next()


    } catch (error) {
        console.log(error)
        res.json({success: false, message: error.message})
        
    }
}

export default authDoctor