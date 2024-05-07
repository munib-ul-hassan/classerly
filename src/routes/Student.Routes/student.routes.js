const { Router } = require('express');

// ############################ Student Routes ########################

const  {registerStudent,refreshAccessToken, deleteStudent, getAllmycourses}  = require("../../controllers/StudentControllers/student.controller.js");

const router=Router();


router.route("/registerStudent/:id").post(registerStudent)
router.route("/delete-student/:id").delete(deleteStudent)
router.route("/resfreshAcessToken").post(refreshAccessToken);


// get requests
router.route("/getall-mycourses/:id").get(getAllmycourses);


//secured routes

router.route("/refesh-token",refreshAccessToken)
module.exports=router;



