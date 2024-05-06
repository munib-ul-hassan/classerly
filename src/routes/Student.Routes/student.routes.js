const { Router } = require('express');

// ############################ Student Routes ########################

const  {registerStudent,refreshAccessToken, deleteStudent}  = require("../../controllers/StudentControllers/student.controller.js");

const router=Router();


router.route("/registerStudent/:id").post(registerStudent)
router.route("/delete-student/:id").delete(deleteStudent)
router.route("/resfreshAcessToken").post(refreshAccessToken);



//secured routes

router.route("/refesh-token",refreshAccessToken)
module.exports=router;



