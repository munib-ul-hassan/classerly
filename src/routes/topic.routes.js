

const { Router } = require('express');
// const { addsubjects, addTopic, allsubjects, alltopicsofsubject, allLessonsoftopics} = require('../controllers/CurriculumControllers/curriculum');
// const { AddTopics, getAllLessonsOfTopics, getcontentOfLesson } = require('./TopicsControllers/Topics.Controllers');


const { verifyadmintoken } = require('../middlewares/auth');


const {AddTopic,getAlltopicsbysubject,deletetopic,updatetopic} =require("../controllers/Topics.Controllers")

const router=Router();



router.route('/').post(verifyadmintoken,AddTopic);
router.route('/:id').get(getAlltopicsbysubject);

router.route('/:id').delete(verifyadmintoken,deletetopic);
router.route('/:id').put(verifyadmintoken,updatetopic);





// // Topics
// router.route('/add-topics/:id').post(AddTopics);
// router.route('/add-lessons/:id').post(AddLessons)
// router.route('/get-all-lessonsof-topic/:id').get(getAllLessonsOfTopics)
// router.route('/get-Lesson-Content/:id').get(getcontentOfLesson);
module.exports=router;