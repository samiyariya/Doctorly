import mongoose from "mongoose";

// Singleton pattern, Observer pattern, Factory pattern, Proxy pattern

// Singleton instance to ensure only one connection is created
let connectionInstance = null;

// Observer Class for connection events
class DBObserver {
    update(event, message) {
        console.log(`${event}: ${message}`);
    }
}

// Factory to create the Observer instance
class DBObserverFactory {
    static createObserver() {
        return new DBObserver();
    }
}

// Factory to create the Database connection
class DBConnectionFactory {
    static createConnection() {
        // Proxy for connection logging and control
        const connectionHandler = {
            apply: async (target, thisArg, args) => {
                console.log('Attempting to connect to MongoDB...');
                const result = await target.apply(thisArg, args);
                console.log('Connection process complete.');
                return result;
            }
        };

        const createConnection = async () => {
            if (connectionInstance) {
                console.log("Using existing database connection");
                return connectionInstance;
            }

            try {
                connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/doctorly`, {});
                console.log("MongoDB is connected");
            } catch (error) {
                console.error("MongoDB connection failed", error);
                process.exit(1);
            }

            // Attach Observer to connection events
            const dbObserver = DBObserverFactory.createObserver(); // Creating observer via factory
            mongoose.connection.on('connected', () => dbObserver.update('connected', 'MongoDB connection established'));
            mongoose.connection.on('error', (err) => dbObserver.update('error', `MongoDB connection error: ${err}`));
            mongoose.connection.on('disconnected', () => dbObserver.update('disconnected', 'MongoDB disconnected'));

            return connectionInstance;
        };

        const proxiedConnection = new Proxy(createConnection, connectionHandler);

        return proxiedConnection();
    }
}

const connectDB = async () => {
    const dbConnection = DBConnectionFactory.createConnection(); // Using Factory to create DB connection
    return dbConnection;
};

export default connectDB;