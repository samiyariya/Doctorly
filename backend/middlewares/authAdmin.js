import jwt from "jsonwebtoken"

// admin authentication middleware
const authAdmin = async (req, res, next) => {
    try {
        
        // getting token from headers
        const {atoken} = req.headers
        if (!atoken) {
            return res.json({success: false, message: "Not Authorized, Login Again"})
        }
        // if the token is present, verify it by decoding the token
        const token_decode = jwt.verify(atoken, process.env.JWT_SECRET)

        // checking if the decoded token is same as the admin email and password
        if (token_decode !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD) {
            return res.json({success: false, message: "Not Authorized, Login Again"})
        }

        next()


    } catch (error) {
        console.log(error)
        res.json({success: false, message: error.message})
        
    }
}

export default authAdmin