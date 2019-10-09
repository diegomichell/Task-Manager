import mongoose from "mongoose";

const connectionURL = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/task-manager-test';

export default {
  start() {
    return mongoose.connect(connectionURL, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true
    });
  },
  disconnect: () => mongoose.disconnect()
};
