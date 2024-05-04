const mongoose=require('mongoose');
const { schema } = require('../StudentModel/student');

const {Schema}=require(mongoose);

const FeedbackSchema=new Schema({
    feedbackby:{
        type:Schema.Types.ObjectId,
        ref : "Parent"
    },
    feedbackto:{
        type:string
    },
    feedback:{
           type:String
    }
})

const FeedbackModel=mongoose.model("feedbac",FeedbackSchema);
module.exports=FeedbackModel;