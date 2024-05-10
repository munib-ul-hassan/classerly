

const { Router } = require('express');
// const { addsubjects, addTopic, allsubjects, alltopicsofsubject, allLessonsoftopics} = require('../../controllers/CurriculumControllers/curriculum');
const { AddTopics, getAllLessonsOfTopics } = require('../../controllers/TopicsControllers/Topics.Controllers');
const { AddSubject, deleteSubject, getAlltopicsofsubject } = require('../../controllers/SubjectController/SubjectController');
const { AddLessons } = require('../../controllers/LessonControollers/LesssonControllers');




const router=Router();



router.route('/add-subject/:id').post(AddSubject);
router.route('/get-alltopics-ofsubject/:id').get(getAlltopicsofsubject);
router.route('/delete-subject/:id').delete(deleteSubject);



// Topics
router.route('/add-topics/:id').post(AddTopics);
router.route('/add-lessons/:id').post(AddLessons)
router.route('/get-all-lessonsof-topic/:id').get(getAllLessonsOfTopics)
module.exports=router;