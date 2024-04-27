const { Router } = require('express');

const  {registerStudent,loginstudent, logoutstudent, refreshAccessToken, forgetPasswordstudent}  = require("../controllers/student.controller.js");
const  verfiyJWT  = require('../middlewares/auth.middleware.js');

const router=Router();

router.route("/registerStudent").post(registerStudent)
router.route("/loginStudent").post(loginstudent)
router.route("/forgetPasswordstudent").post(forgetPasswordstudent);


//secured routes
router.route("/logoutStudent").post(verfiyJWT,logoutstudent)
router.route("/refesh-token",refreshAccessToken)
module.exports=router;