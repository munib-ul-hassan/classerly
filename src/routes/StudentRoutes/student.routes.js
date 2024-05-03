const { Router } = require('express');

const  {registerStudent,refreshAccessToken}  = require("../../controllers/StudentControllers/student.controller.js");

const router=Router();


router.route("/registerStudent").post(registerStudent)

router.route("/resfreshAcessToken").post(refreshAccessToken);



//secured routes

router.route("/refesh-token",refreshAccessToken)
module.exports=router;



