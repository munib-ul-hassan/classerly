const mongoose=require('mongoose');

const quizesSchema=new Schema({
    createdBy:{
        type:Schema.Types.ObjectId,
        ref : "Teacher"
    },
    questions:[{
        type:Schema.Types.ObjectId,
        ref : "Questions"
    }],
    grade:{
        type:Schema.Types.ObjectId,
        ref : "Grade"
    },
    topic:{
        type:Schema.Types.ObjectId,
        ref : "Topic"
    },
    subject:{
        type:Schema.Types.ObjectId,
        ref : "Subject"
    },
    startsAt:{
        type:Date
    },
    endsAt:{
        type:Date
    },

    score:Number
},{
    timestamps:true
    })

const QuizesModel=mongoose.model("Quizes",quizesSchema);
module.exports=QuizesModel;