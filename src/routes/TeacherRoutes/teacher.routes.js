const { Router } = require('express');
const { registerStudent } = require('../../controllers/StudentControllers/student.controller');


const router=Router();


router.route("/register-teacher").post(registerStudent);

module.exports=router;