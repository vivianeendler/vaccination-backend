import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";

import ScheduleRouter from "../src/router/ScheduleRouter.js";

dotenv.config();
const PORT = process.env.PORT || 3000;
const DATABASE_URL = process.env.DATABASE_URL;

let options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    keepAlive: true,
    connectTimeoutMS: 30000,
};

mongoose
    .connect(DATABASE_URL, options)
    .then(() => console.log("Database connected"))
    .catch((error) => console.log({ error }));

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api", ScheduleRouter);

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});
