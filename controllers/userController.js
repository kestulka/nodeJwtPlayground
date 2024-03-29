const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const asyncHandler = require("express-async-handler");

// @route POST /api/users

const registerUser = asyncHandler(async (req, res) => {
  const { firstname, email, password } = req.body;
  if (!firstname || !email || !password) {
    res.status(400);
    throw new Error("Please add all fields");
  }

  // check if user exists

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  // hash password = kiek simboliu reikia papildomai prideti uzsifruojant

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // create user

  const user = await User.create({
    firstname,
    email,
    password: hashedPassword,
  });

  if (user) {
    res.status(201).json({
      // sukuria json objekta, kuris yra siunciamas response i client
      _id: user.id,
      firstname: user.firstname,
      email: user.email,
      token: generateToken(user._id),
      role: user.role,
    });

  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// generate jwt: imamas userio id ir prie jo pridedama uzkodavimo druskyte
// papildomas dalykas, kad butu neimanoma atkoduoti is .env failo

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// @route POST /api/users/login - paimam duomenis is userio ir siunciam i DB pasitikrint ar toks useris yra

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  // user.password - is db uzkoduotas password, lygina login'e ivesta passworda su db esanciu uzkoduotu passwordu
  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      _id: user.id,
      firstname: user.firstname,
      email: user.email,
      // svarbiausia, kad sugriztu token, kuris sukuriamas backende
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid credentials");
  }
});

// @desc get user data
// @route GET /api/users/user
// @access private

const getUser = asyncHandler(async (req, res) => {
  res.status(200).json(req.user);
});

// @desc get users data
// @route GET /api/users/list
// @access private

const getUsers = asyncHandler(async (req, res) => {
  const users = await User.aggregate([
    {
      $lookup: {
        from: "ads",
        localField: "_id",
        foreignField: "user",
        as: "ads",
      },
    },
    {
      $match: { role: { $in: ["simple", "admin"] } }, // rodys visus userius ir simple ir admin
    },
    {
      // cia bus isvardinami dalykai, kuriu nereikia, kad rodytu kai pagetina userius
      $unset: [
        "password",
        "createdAt",
        "updatedAt",
        "goals.createdAt",
        "ads.updatedAt",
        "ads.__v",
        "__v",
      ],
    },
  ]);

  res.status(200).json(users);
});

// EJS

const homepage = async (req, res) => {
  const locals = {
    title: "Skelbimukai",
    description: "Management system",
  };
  res.render("index", locals);
};

// New customer form

const addUser = async (req, res) => {
  const locals = {
    title: "Skelbimukai",
    description: "Management system",
  };

  res.render("add", locals);
};

// create new user in form

const postUser = async (req, res) => {
  const newUser = new User({
    firstname: req.body.firstname,
    email: req.body.email,
    password: req.body.password,
  });

  try {
    await User.create(newUser);
    res.redirect("/");
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUser,
  getUsers,
  homepage,
  addUser,
  postUser,
};
