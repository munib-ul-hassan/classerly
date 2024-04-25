const { Router } = require('express');

const  {registerStudent,loginstudent}  = require("../controllers/student.controller.js");

const router=Router();

router.route("/registerStudent").post(registerStudent)
router.route("/loginStudent").post(loginstudent)
module.exports=router;