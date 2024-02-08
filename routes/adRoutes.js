// tikrinama ar public ar private access, kokias funkcijas gales daryti tam tikras useris

const express = require("express");
const router = express.Router();

const { setAd, getAds, updateAd } = require("../controllers/adController");
const { protect } = require("../middleware/auth");

router.route("/").post(protect, setAd).get(protect, getAds);
router.route("/:id").put(protect, updateAd);

module.exports = router;
