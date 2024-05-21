const { Router } = require('express');

// ############################ Student Routes ########################

const  {registerStudent,refreshAccessToken, getAllmysubjects}  = require("../../controllers/StudentControllers/student.controller.js");

const router=Router();


router.route("/registerStudent/:id").post(registerStudent)

router.route("/resfreshAcessToken").post(refreshAccessToken);


// get requests
router.route("/getall-mycourses/:id").post(getAllmysubjects);


//secured routes

router.route("/refesh-token",refreshAccessToken)
module.exports=router;



