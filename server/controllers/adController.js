const asyncHandler = require("express-async-handler");

const Ad = require("../models/Ad");

//@desc Set ads
//@route POST /api/ads
//@access private

const setAd = asyncHandler(async (req, res) => {
  if (!req.body.text || !req.body.description || !req.body.price) {
    res.status(400);
    throw new Error("Please add all required fields");
  }

  const ad = await Ad.create({
    text: req.body.text,
    description: req.body.description,
    price: req.body.price,
    user: req.user.id,
  });
  res.status(200).json(ad);
});

//@desc get ads
//@route GET /api/ads
//@access private

const getAds = asyncHandler(async (req, res) => {
  const ads = await Ad.find({ user: req.user.id });
  res.status(200).json(ads);
});

// @desc Update ad
// @route PUT /api/ads/:id
// @access private

const updateAd = asyncHandler(async (req, res) => {
  const ad = await Ad.findById(req.params.id);

  if (!ad) {
    res.status(400);
    throw new Error("Ad not found");
  }

  // check for user
  if (!req.user) {
    res.status(401);
    throw new Error("User not found");
  }

  // make sure the logged in user matches the ad user
  if (ad.user.toString() !== req.user.id && req.user.role !== "admin") {
    res.status(401);
    throw new Error("User not authorized");
  }

  // make sure the logged in user matches the ads user
  if (req.user.role === "admin" || ad.user.toString() === req.user.id) {
    // response turi grazinti atnaujinta skelbima
    const updateAd = await Ad.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json(updateAd);
  }
});

// @desc Delete ad
// @route DELETE /api/ads/:id
// @access private

const deleteAd = asyncHandler(async (req, res) => {
  const ad = await Ad.findById(req.params.id);

  if (!ad) {
    res.status(400);
    throw new Error("Ad not found");
  }

  // check for user
  if (!req.user) {
    res.status(401);
    throw new Error("User not found");
  }

  // make sure the logged in user matches the ad user
  if (ad.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("User not authorized");
  }

  await Ad.findByIdAndDelete(req.params.id);

  res.status(200).json({ id: req.params.id });
});

module.exports = {
  setAd,
  getAds,
  updateAd,
  deleteAd,
};
