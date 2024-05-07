const {Router}=require('express');
const { addGrade, getAllGrades, getAllSubjectsOfGrade } = require('../../controllers/GradeControllers/GradeController');

const router=Router();


router.route('/add-grade').post(addGrade);
router.route('/all-grades').get(getAllGrades);
router.route("/all-subjects-ofgrade/:id").get(getAllSubjectsOfGrade)
module.exports=router;