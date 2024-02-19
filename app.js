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
app.use(errorHandler);

// Static files

app.use(express.static("public"));

// Templating engine

app.use(expressLayout);
app.set("layout", "./main"); // pathas i main ejs faila
app.set("view engine", "ejs");

// Routes

app.use("/", require("./routes/userRoutes.js"));
app.use("/", require("./routes/adRoutes.js"));

// Handle 404
app.get("*", (req, res) => {
  res.status(404).render("404");
});

// ensure that server is running
app.listen(process.env.PORT, () =>
  console.log(`Server is running on port ${process.env.PORT}`),
);
