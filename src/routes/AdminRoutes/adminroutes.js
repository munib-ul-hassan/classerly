const {Router}=require('express');
const { deleteStudent } = require('../../controllers/StudentControllers/student.controller');
const { deleteSubject } = require('../../controllers/SubjectController/SubjectController');
const { AdminAddEvent } = require('../../controllers/AdminControllers/admincontrollers');

const router=Router();

// subject
router.route('/delete-subject/:id').delete(deleteSubject);

// student
router.route("/delete-student/:id").delete(deleteStudent)

router.route('/add-event').post(AdminAddEvent);
module.exports=router;