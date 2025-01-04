import jwt from "jsonwebtoken";

// Strategy Design Pattern: Token Verification
// Strategy interface
class TokenVerificationStrategy {
    verify(token) {
        throw new Error("Method 'verify' must be implemented.");
    }
}

// Concrete strategy for JWT verification
class JWTVerificationStrategy extends TokenVerificationStrategy {
    verify(token) {
        return jwt.verify(token, process.env.JWT_SECRET);
    }
}

// Context class for strategy
class TokenVerifier {
    constructor(strategy) {
        this.strategy = strategy;
    }

    setStrategy(strategy) {
        this.strategy = strategy;
    }

    verify(token) {
        return this.strategy.verify(token);
    }
}

// Base Middleware (uses Strategy Design Pattern)
const authUserBase = async (req, res, next) => {
    try {
        const { token } = req.headers;
        if (!token) {
            return res.json({ success: false, message: "Not Authorized, Login Again" });
        }

        // Use the strategy to verify the token
        const verifier = new TokenVerifier(new JWTVerificationStrategy());
        const token_decode = verifier.verify(token);

        req.body.userId = token_decode.id;

        next();
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

// Decorator Design Pattern: Add Role-Based Access
const withRoleCheck = (middleware, allowedRoles) => {
    return async (req, res, next) => {
        await middleware(req, res, async () => {
            const userRole = req.body.userRole; // Assume `userRole` is part of the request body
            if (!allowedRoles.includes(userRole)) {
                return res.json({ success: false, message: "Access Denied" });
            }
            next();
        });
    };
};

// Decorator Design Pattern: Add Logging
const withLogging = (middleware) => {
    return async (req, res, next) => {
        console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
        await middleware(req, res, next);
    };
};

// Final Middleware: Admin Authentication with Role Check and Logging
const authAdmin = withLogging(withRoleCheck(authUserBase, ["admin"]));

export default authAdmin;




// import jwt from "jsonwebtoken"

// // admin authentication middleware
// const authUser = async (req, res, next) => {
//     try {
        
//         // getting token from headers
//         const {token} = req.headers
//         if (!token) {
//             return res.json({success: false, message: "Not Authorized, Login Again"})
//         }
//         // if the token is present, verify it by decoding the token
//         const token_decode = jwt.verify(token, process.env.JWT_SECRET)

//         // we'll get user id from the token & get added in req.body 
//         req.body.userId = token_decode.id

//         next()


//     } catch (error) {
//         console.log(error)
//         res.json({success: false, message: error.message})
        
//     }
// }

// export default authUser
