// tikrinama ar public ar private access, kokias funkcijas gales daryti tam tikras useris

const express = require("express");
const router = express.Router();

const {
  setAd,
  getAds,
  updateAd,
  deleteAd,
} = require("../controllers/adController");
const protect = require("../middleware/auth");

router.route("/add/ad").post(protect, setAd).get(protect, getAds);
router.route("/add/ad/:id").put(protect, updateAd).delete(protect, deleteAd);

module.exports = router;
