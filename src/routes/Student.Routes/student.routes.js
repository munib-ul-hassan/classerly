const { Router } = require('express');

// ############################ Student Routes ########################

const  {registerStudent,refreshAccessToken}  = require("../../controllers/StudentControllers/student.controller.js");

const router=Router();


router.route("/registerStudent").post(registerStudent)

router.route("/resfreshAcessToken").post(refreshAccessToken);



//secured routes

router.route("/refesh-token",refreshAccessToken)
module.exports=router;



