const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const bodyParser = require("body-parser");
const customerRoute = require("./routes/route.customer");
const genericRoute = require("./routes/route.generic");
const orderRoute = require("./routes/route.order");
const cors = require("cors");
const { PORT } = require("./config");
const { beforeStart } = require("./db/db.mysql");

async function startServer() {
  try {
    const app = express();
    app.use(cors());
    app.use(bodyParser.json());

    //Set up user Route
    app.use("/customer", customerRoute);
    app.use("/order", orderRoute);
    app.use("/generic", genericRoute);

    await app.listen(PORT);
    console.log(`Server is running on port ${PORT}`);

    //Perform database creation, drop tables, create tables and insert rows in all tables
    await beforeStart();
  } catch (err) {}
}

startServer();
