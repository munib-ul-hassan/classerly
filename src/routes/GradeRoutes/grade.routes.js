const {Router}=require('express');
const { addGrade } = require('../../controllers/GradeControllers/GradeController');

const router=Router();


router.route('/add-grade').post(addGrade);

module.exports=router;