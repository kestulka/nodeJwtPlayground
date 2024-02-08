require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const errorHandler = require("./middleware/errorHandler.js");

connectDB();

const app = express();

app.use(cors());
app.options("*", cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/ads", require("./routes/adRoutes"));

app.use(errorHandler);

app.listen(process.env.PORT, () =>
  console.log(`Server is running on port ${process.env.PORT}`),
);
