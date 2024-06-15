const { Router } = require("express");

const { AdminAddEvent } = require("../controllers/admincontrollers");
const { verifyadmintoken } = require("../middlewares/auth");

const router = Router();

router.route("/event").post(verifyadmintoken, AdminAddEvent);
module.exports = router;
