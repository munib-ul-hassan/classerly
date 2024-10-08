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
type:{
    type:String,
    enum:["universal", "private"],
    default:"universal"
},
    startsAt:{
        type:Date
    },
    endsAt:{
        type:Date
    },
    image:{type:String,default:"https://res.cloudinary.com/deiylfley/image/upload/v1724794748/image_2024-08-28_023903555_xek0vx.png"},

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