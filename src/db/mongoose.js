import mongoose from "mongoose";

const connectionURL = process.env.MONGODB_URI;

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
