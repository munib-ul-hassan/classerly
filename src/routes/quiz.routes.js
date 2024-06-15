const { Router } = require('express');

const {
    addquiz,
    updatestatusquiz,
    addananswer,
    getquizes} = require('../controllers/quiz.contrroller.js');
const { verifytoken, verifyteachertoken } = require('../middlewares/auth');


const router=Router();

router.route("/teacher").post(verifyteachertoken, addquiz);
router.route("/student/:id").post(verifytoken, updatestatusquiz);
router.route("/student").post(verifytoken, addananswer);
router.route("/").get(verifytoken, getquizes);

module.exports=router;