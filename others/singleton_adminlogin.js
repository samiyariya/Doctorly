
// Singleton Pattern - Ensures only one instance of admin credentials validation
class AdminAuthenticator {
    constructor() {
        if (!AdminAuthenticator.instance) {
            AdminAuthenticator.instance = this;
        }
        return AdminAuthenticator.instance;
    }

    authenticate(email, password) {
        return email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD;
    }
}

// API for admin login
const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const authenticator = new AdminAuthenticator();

        if (authenticator.authenticate(email, password)) {
            const token = jwt.sign(email + password, process.env.JWT_SECRET);
            res.json({ success: true, token });
        } else {
            res.json({ success: false, message: 'Invalid Credentials' });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};