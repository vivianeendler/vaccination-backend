import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

const mongoServer = new MongoMemoryServer();
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    keepAlive: true,
    connectTimeoutMS: 30000,
};

export async function connect() {
    await mongoServer.start();

    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri, options);
}

export async function closeDatabase() {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop();
}

export async function clearDatabase() {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
        await collections[key].deleteMany();
    }
}
