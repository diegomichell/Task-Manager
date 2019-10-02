import mongoose from "mongoose";

const databaseName = "task-manager";
const connectionURL = process.env.MONGODB_URI || `mongodb://127.0.0.1:27017/${databaseName}`;

export default {
  start: () => {
    return mongoose.connect(connectionURL, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false
    });
  }
};
