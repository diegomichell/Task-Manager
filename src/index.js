import express from "express";
import db from "./db/mongoose";
import { UserRouter, TaskRouter } from "./routes";

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
