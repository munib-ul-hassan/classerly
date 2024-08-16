const { Router } = require("express");
const { verifystudenttoken } = require("../middlewares/auth");
const { getmyrequests, updaterequest } = require("../controllers/studentController");

const router = Router();
router.route("/myrequests").get(verifystudenttoken, getmyrequests);
router.route("/request/:id").put(verifystudenttoken,updaterequest);


module.exports=router;
