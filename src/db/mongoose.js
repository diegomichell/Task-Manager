const mongoose = require("mongoose");

const databaseName = "task-manager";
const connectionURL = process.env.MONGODB_URI || `mongodb://127.0.0.1:27017/${databaseName}`;

module.exports = {
  start: () => {
    return mongoose.connect(connectionURL, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false
    });
  }
};
