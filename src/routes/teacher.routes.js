const { Router } = require('express');

const { myFeedBacks,mystudents,addstudent,mydashboard,mycourses, addfeedback} = require('../controllers/TeacherContrroller');
const { verifytoken, verifyteachertoken } = require('../middlewares/auth');


const router=Router();



router.route("/feedback").get(verifytoken, myFeedBacks);
router.route("/dashboard").get(verifytoken, mydashboard);
router.route("/mycourses").get(verifyteachertoken, mycourses);
router.route('/feedback').post(verifyteachertoken,addfeedback);

router.route("/mystudents").get(verifyteachertoken, mystudents);
router.route("/addstudent").post(verifyteachertoken, addstudent);


module.exports=router;