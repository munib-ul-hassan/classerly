const { Router } = require('express');

const { registerTeacher, teacherAddsubjects, allSubjectsOfteacher, feedBacktoTeacher, myFeedBacks } = require('../../controllers/Teacher.Controller/TeacherContrroller');


const router=Router();


router.route("/register-teacher").post(registerTeacher);
router.route("/teacher-addsubject/:id").post(teacherAddsubjects);
router.route("/teacher-all-subjects/:id").get(allSubjectsOfteacher);
router.route("/feedback-to-teacher/:id").post(feedBacktoTeacher);
router.route("/my-feedbacks/:id").get(myFeedBacks);
module.exports=router;