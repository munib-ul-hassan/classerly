const mongoose=require('mongoose');

const quizesSchema=new mongoose.Schema({
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref : "Teacher"
    },
    questions:[{
        type:mongoose.Schema.Types.ObjectId,
        ref : "Questions"
    }],
    grade:{
        type:mongoose.Schema.Types.ObjectId,
        ref : "Grade"
    },
    topic:{
        type:mongoose.Schema.Types.ObjectId,
        ref : "Topic"
    },
    lesson:{
        type:mongoose.Schema.Types.ObjectId,
        ref : "Lessons"
    },
    subject:{
        type:mongoose.Schema.Types.ObjectId,
        ref : "subject"
    },
    startsAt:{
        type:Date
    },
    endsAt:{
        type:Date
    },
    status: {
        type: String,
        enum: ["pending", "start", "complete"],
        default: "pending",
      },
    score:Number
},{
    timestamps:true
    })

const QuizesModel=mongoose.model("Quizes",quizesSchema);
module.exports=QuizesModel;