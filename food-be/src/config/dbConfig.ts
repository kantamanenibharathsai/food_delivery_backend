import mongoose from "mongoose";
import logger from "../loggers/logger";
const dbUrl = process.env.DBURL ?? "";

export default async function connectDB() {
  console.log(dbUrl);
  try {
    const connection = await mongoose.connect(dbUrl);
    logger.info("db connection successful");
    return Promise.resolve(connection);
  } catch (err) {
    logger.error(JSON.stringify(err) + "db connection error");
    return Promise.reject(err);
  }
}
