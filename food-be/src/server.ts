import dotenv from "dotenv";
dotenv.config();
import connectDB from "./config/dbConfig";

import app from "./app";

const PORT = process.env.PORT || 8089;

async function startServer() {
  try {
    const dbConnection = await connectDB();
    app.listen(PORT, () => {
      console.log(`listening on port 10.10.0.219/${PORT}`);
    });
  } catch (err) {
    console.log(err);
  }
}
startServer();
