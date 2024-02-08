// tikrinama ar public ar private access, kokias funkcijas gales daryti tam tikras useris

const express = require("express");
const router = express.Router();

const { setAd } = require("../controllers/adController");
const { protect } = require("../middleware/auth");

router.route("/").post(protect, setAd);

module.exports = router;
