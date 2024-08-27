const {Router}=require('express');
const { addNewChild, getMyChilds ,addfeedback, updatefeedback,getnotification,myFeedBacks,getQuizInfo, getMyChildbyId} = require("../controllers/parent.controllers");
const { verifytoken, verifyparenttoken } = require('../middlewares/auth');



const router=Router();


// ###################### Parents Routes #########################
// router.route('/registerParent').post(registerparent);
router.route('/addchild').post(verifytoken,addNewChild);
router.route('/getNotification').get(verifytoken,getnotification);


router.route('/parent/feedback/:id').get(verifyparenttoken,myFeedBacks);

router.route('/mychilds').get(verifytoken,getMyChilds);

router.route('/mychild/:id').get(verifytoken,getMyChildbyId);


router.route("/getquizinfo/:id").get(verifytoken,getQuizInfo);




module.exports=router;