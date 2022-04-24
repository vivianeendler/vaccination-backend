import swaggerAutogen from "swagger-autogen";
import dotenv from "dotenv";

dotenv.config();

const doc = {
    info: {
        title: process.env.SWAGGER_TITLE,
        description: process.env.SWAGGER_DESCRIPTION,
    },
    host: `${process.env.HOST}:${process.env.PORT}`,
    schemes: ["http"],
};

const outputFile = "./src/swagger_output.json";
const endpointsFiles = ["./src/index.js"];

swaggerAutogen()(outputFile, endpointsFiles, doc).then(async () => {
    await import("./index.js");
});
