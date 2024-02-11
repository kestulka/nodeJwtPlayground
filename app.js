require("dotenv").config();
const express = require("express");
const connectToDB = require("./config/db");
const cors = require("cors");
const errorHandler = require("./middleware/errorHandler.js");
const expressLayout = require("express-ejs-layouts");

connectToDB();

const app = express();
app.use(express.json());
app.use(cors());
app.options("*", cors());
app.use(express.urlencoded({ extended: false }));

app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/ads", require("./routes/adRoutes"));
app.use(errorHandler);

// templating engine

app.use(expressLayout);
app.set("layout", "./layouts/main");
app.set("view engine", "ejs");

app.listen(process.env.PORT, () =>
  console.log(`Server is running on port ${process.env.PORT}`),
);
