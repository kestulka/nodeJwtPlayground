require("dotenv").config();
const express = require("express");
const connectToDB = require("./server/config/db.js");
const cors = require("cors");
const errorHandler = require("./server/middleware/errorHandler.js");

connectToDB();

const app = express();
app.use(express.json());
app.use(cors());
app.options("*", cors());
app.use(express.urlencoded({ extended: false }));

app.use("/api/users", require("./server/routes/userRoutes.js"));
app.use("/api/ads", require("./server/routes/adRoutes.js"));
app.use(errorHandler);

app.listen(process.env.PORT, () =>
  console.log(`Server is running on port ${process.env.PORT}`),
);
