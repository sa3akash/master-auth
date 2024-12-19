import mongoose from "mongoose";
import { config } from "@root/config";

export const dbConnect = () => {
  const connect = () => {
    mongoose
      .connect(config.DATABASE_URL!)
      .then(() => {
        console.log("DB SUCCESSFULLY CONNECTED");
      })
      .catch((err) => {
        console.log(err.message);
        process.exit(1);
      });
  };
  connect();
  mongoose.connection.on("disconnected", connect);
};
