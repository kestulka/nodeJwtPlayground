const express = require("express");

const router = express.Router();

const {
  registerUser,
  loginUser,
  getUser,
  getUsers,
  homepage,
  addUser,
  postUser,
} = require("../controllers/userController");

const protect = require("../middleware/auth");

const protectAdmin = require("../middleware/adminAuth");

router.use(express.static('public'))
router.get("/register", (req, res) => {
  res.sendFile('register.html', {root: "public"})
})
router.get("/login", (req, res) => {
  res.sendFile('login.html', {root: "public"})
})



router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/user", protect, getUser);
router.get("/list", protectAdmin, getUsers);

router.get("/", homepage);
router.get("/add", addUser);
router.post("/add", postUser);

module.exports = router;
