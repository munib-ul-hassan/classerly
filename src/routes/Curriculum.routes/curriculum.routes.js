

const { Router } = require('express');
// const { addsubjects, addTopic, allsubjects, alltopicsofsubject, allLessonsoftopics} = require('../../controllers/CurriculumControllers/curriculum');
const { AddTopics } = require('../../controllers/TopicsControllers/Topics.Controllers');
const { AddSubject } = require('../../controllers/SubjectController/SubjectController');




const router=Router();

// ############################ admin routes of curriculum ##############################
// router.route('/addsubject').post(addsubjects);
// router.route('/addtopic').post(addTopic)
// router.route('/addlesson').post(addlesson);


// ####################### public routes of curriculum ##############################
// router.route('/allsubjects').post(allsubjects)
// router.route('/alltopics').post(alltopicsofsubject);
// router.route('/allLessons').post(allLessonsoftopics);

router.route('/add-subject/:id').post(AddSubject);
router.route('/add-topics/:id').post(AddTopics);
module.exports=router;