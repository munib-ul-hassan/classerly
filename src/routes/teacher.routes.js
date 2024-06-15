const { Router } = require('express');

const { myFeedBacks } = require('../controllers/TeacherContrroller');
const { verifytoken } = require('../middlewares/auth');


const router=Router();



router.route("/feedback").get(verifytoken, myFeedBacks);
module.exports=router;