const { Router } = require('express');

const { registerTeacher, teacherAddsubjects, allSubjectsOfteacher } = require('../../controllers/Teacher.Controller/TeacherContrroller');


const router=Router();


router.route("/register-teacher").post(registerTeacher);
router.route("/teacher-addsubject/:id").post(teacherAddsubjects);
router.route("/teacher-all-subjects/:id").get(allSubjectsOfteacher);
module.exports=router;