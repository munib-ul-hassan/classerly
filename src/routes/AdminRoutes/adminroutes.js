const {Router}=require('express');
const { deleteStudent } = require('../../controllers/StudentControllers/student.controller');
const { deleteSubject } = require('../../controllers/SubjectController/SubjectController');

const router=Router();

// subject
router.route('/delete-subject/:id').delete(deleteSubject);

// student
router.route("/delete-student/:id").delete(deleteStudent)

module.exports=router;