const {Router}=require('express');
const { addGrade, getAllGrades } = require('../../controllers/GradeControllers/GradeController');

const router=Router();


router.route('/add-grade').post(addGrade);
router.route('/all-grades').get(getAllGrades);
module.exports=router;