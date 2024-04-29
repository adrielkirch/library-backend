const dotenv = require("dotenv");
dotenv.config();
const conn = require("./db/db.mysql");
const express = require("express");
const bodyParser = require("body-parser");
const customerRoute = require("./routes/route.customer");
const orderRoute = require("./routes/route.order");
const { PORT } = require("./config");

async function startServer() {
  const app = express();

  app.use(bodyParser.json());

  //Set up user Route
  app.use("/customer", customerRoute);
  app.use("/order", orderRoute);
  await app.listen(PORT);
  console.log(`Server is running on port ${PORT}`);
}

startServer();
