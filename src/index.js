const express = require("express");
const db = require("./db/mongoose");
const { UserRouter, TaskRouter } = require("./routes");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use(UserRouter);
app.use(TaskRouter);

db.start().then(() => {
  app.listen(port, () => {
    console.log("Server running on port " + port);
  });
});
