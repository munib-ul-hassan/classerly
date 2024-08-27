const { Router } = require("express");
const { verifystudenttoken } = require("../middlewares/auth");
const { getmyrequests, updaterequest,addfeedback,updatefeedback ,getmyteacher,myresult, myFeedBacks} = require("../controllers/studentController");

const router = Router();
router.route("/myrequests").get(verifystudenttoken, getmyrequests);
router.route("/myteachers").get(verifystudenttoken, getmyteacher);
router.route("/myresult").get(verifystudenttoken, myresult);


router.route("/request/:id").put(verifystudenttoken,updaterequest);
router.route('/feedback').post(verifystudenttoken,addfeedback);
router.route('/feedback/:id').put(verifystudenttoken,updatefeedback);
router.route("/feedback").get(verifystudenttoken, myFeedBacks);

module.exports=router;
