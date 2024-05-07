const { Router } = require('express');

const { registerTeacher } = require('../../controllers/Teacher.Controller/TeacherContrroller');


const router=Router();


router.route("/register-teacher").post(registerTeacher);

module.exports=router;