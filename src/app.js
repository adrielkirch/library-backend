const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const bodyParser = require("body-parser");
const customerRoute = require("./routes/route.customer");
const genericRoute = require("./routes/route.generic");
const orderRoute = require("./routes/route.order");
const { PORT } = require("./config");
const { createDatabase, dropTables, createTables, createManyRows,releaseConnection } = require("./db/db.mysql");

async function startServer() {
  try {
  
    const app = express();

    app.use(bodyParser.json());

    //Set up user Route
    app.use("/customer", customerRoute);
    app.use("/order", orderRoute);
    app.use("/generic", genericRoute);

    await app.listen(PORT);
    console.log(`Server is running on port ${PORT}`);
    await createDatabase();
    await dropTables();
    await createTables();
    await createManyRows(); 
    await releaseConnection();

  } catch (err) {}
}

startServer();
