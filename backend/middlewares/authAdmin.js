import jwt from "jsonwebtoken";

// Observer Pattern, Strategy Pattern, Factory Pattern, Decorator Pattern

// Observer Pattern for Logging Events
class SecurityObserver {
    notify(event, message) {
        console.log(`${event}: ${message}`);
    }
}
const securityObserver = new SecurityObserver();

// Strategy Pattern for Different Authentication Methods
class AuthStrategy {
    authenticate(req) {
        throw new Error('AuthStrategy#authenticate must be implemented');
    }
}

class AdminAuthStrategy extends AuthStrategy {
    authenticate(req) {
        const { atoken } = req.headers;
        if (!atoken) {
            securityObserver.notify('Unauthorized', 'Admin token missing');
            throw new Error('Not Authorized, Login Again');
        }
        const token_decode = jwt.verify(atoken, process.env.JWT_SECRET);
        if (token_decode !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD) {
            securityObserver.notify('Unauthorized', 'Invalid admin token');
            throw new Error('Not Authorized, Login Again');
        }
    }
}

// Factory Pattern for Creating Middleware
class AuthMiddlewareFactory {
    static createAuthMiddleware(strategy) {
        return async (req, res, next) => {
            try {
                strategy.authenticate(req);
                next();
            } catch (error) {
                res.json({ success: false, message: error.message });
            }
        };
    }
}

// Decorator Pattern for Logging Middleware Activity
const logWrapper = (middleware) => {
    return async (req, res, next) => {
        console.log(`Auth attempt at ${new Date().toISOString()}`);
        try {
            await middleware(req, res, next);
        } catch (error) {
            console.error('Auth Error:', error);
            res.json({ success: false, message: 'Internal Server Error' });
        }
    };
};

// Create Admin Middleware using Factory and Strategy
const adminAuthStrategy = new AdminAuthStrategy();
const authAdmin = AuthMiddlewareFactory.createAuthMiddleware(adminAuthStrategy);

// Apply Decorator for Logging
export default logWrapper(authAdmin);






// import jwt from "jsonwebtoken";

// // Decorator Pattern

// const logWrapper = (middleware) => {
//     return async (req, res, next) => {
//         console.log(`Admin auth attempt at ${new Date().toISOString()}`);
//         try {
//             await middleware(req, res, next);
//         } catch (error) {
//             console.error('Auth Error:', error);
//             res.json({ success: false, message: 'Internal Server Error' });
//         }
//     };
// };

// const authAdmin = async (req, res, next) => {
//     try {
//         const { atoken } = req.headers;
//         if (!atoken) {
//             return res.json({ success: false, message: 'Not Authorized, Login Again' });
//         }

//         const token_decode = jwt.verify(atoken, process.env.JWT_SECRET);

//         if (token_decode !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD) {
//             return res.json({ success: false, message: 'Not Authorized, Login Again' });
//         }

//         next();
//     } catch (error) {
//         console.log(error);
//         res.json({ success: false, message: error.message });
//     }
// };

// export default logWrapper(authAdmin);






// import jwt from "jsonwebtoken"

// // admin authentication middleware
// const authAdmin = async (req, res, next) => {
//     try {
        
//         // getting token from headers
//         const {atoken} = req.headers
//         if (!atoken) {
//             return res.json({success: false, message: "Not Authorized, Login Again"})
//         }
//         // if the token is present, verify it by decoding the token
//         const token_decode = jwt.verify(atoken, process.env.JWT_SECRET)

//         // checking if the decoded token is same as the admin email and password
//         if (token_decode !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD) {
//             return res.json({success: false, message: "Not Authorized, Login Again"})
//         }

//         next()


//     } catch (error) {
//         console.log(error)
//         res.json({success: false, message: error.message})
        
//     }
// }

// export default authAdmin