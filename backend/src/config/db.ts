import { MONGO_URI } from "../constants/env";
import mongoose from "mongoose";

export const connectionToDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("SUCCESSFULLY CONNECTED TO DB")
  } catch (error) {
    console.log("Couldn't connect to DATABASE", error)
    process.exit(1);
  }
}