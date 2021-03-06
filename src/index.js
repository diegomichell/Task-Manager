import db from "./db/mongoose";
import app from './app';

const port = process.env.PORT || 3000;

db.start().then(() => {
  app.listen(port, () => {
    console.log("Server running on port " + port);
  });
});
