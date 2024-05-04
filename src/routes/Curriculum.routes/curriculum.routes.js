

const { Router } = require('express');
const { addsubjects, addTopic, addlesson, allsubjects, alltopicsofsubject, allLessonsoftopics} = require('../../controllers/CurriculumControllers/curriculum');




const router=Router();

// ############################ admin routes of curriculum ##############################
router.route('/addsubject').post(addsubjects);
router.route('/addtopic').post(addTopic)
router.route('/addlesson').post(addlesson);


// ####################### public routes of curriculum ##############################
router.route('/allsubjects').post(allsubjects)
router.route('/alltopics').post(alltopicsofsubject);
router.route('/allLessons').post(allLessonsoftopics);
module.exports=router;