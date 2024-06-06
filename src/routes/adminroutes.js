const {Router}=require('express');
const { deleteStudent } = require('../controllers/student.controller');
const { deleteSubject } = require('../controllers/SubjectController');
const { AdminAddEvent } = require('../controllers/admincontrollers');

const router=Router();

// subject
router.route('/delete-subject/:id').delete(deleteSubject);

// student
router.route("/delete-student/:id").delete(deleteStudent)

router.route('/add-event').post(AdminAddEvent);
module.exports=router;