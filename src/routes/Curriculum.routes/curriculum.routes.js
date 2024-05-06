

const { Router } = require('express');
// const { addsubjects, addTopic, allsubjects, alltopicsofsubject, allLessonsoftopics} = require('../../controllers/CurriculumControllers/curriculum');
const { AddTopics } = require('../../controllers/TopicsControllers/Topics.Controllers');
const { AddSubject } = require('../../controllers/SubjectController/SubjectController');




const router=Router();



router.route('/add-subject/:id').post(AddSubject);
router.route('/add-topics/:id').post(AddTopics);
module.exports=router;