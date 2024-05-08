const { Router } = require('express');

const { registerTeacher, teacherAddsubjects } = require('../../controllers/Teacher.Controller/TeacherContrroller');


const router=Router();


router.route("/register-teacher").post(registerTeacher);
router.route("/teacher-addsubject/:id").post(teacherAddsubjects);
module.exports=router;