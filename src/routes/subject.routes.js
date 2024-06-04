

const { Router } = require('express');
// const { addsubjects, addTopic, allsubjects, alltopicsofsubject, allLessonsoftopics} = require('../../controllers/CurriculumControllers/curriculum');
// const { AddTopics, getAllLessonsOfTopics, getcontentOfLesson } = require('./TopicsControllers/Topics.Controllers');
const { AddSubject, getAlltopicsofsubject ,getAllsubjectsbygrade} = require('../controllers/SubjectController/SubjectController');
const { AddLessons } = require('../controllers/LessonControollers/LesssonControllers');




const router=Router();



router.route('/').post(AddSubject);
router.route('/grade/:id').get(getAllsubjectsbygrade);




// // Topics
// router.route('/add-topics/:id').post(AddTopics);
// router.route('/add-lessons/:id').post(AddLessons)
// router.route('/get-all-lessonsof-topic/:id').get(getAllLessonsOfTopics)
// router.route('/get-Lesson-Content/:id').get(getcontentOfLesson);
module.exports=router;