const mongoose=require("mongoose");
const {Schema}=require("mongoose");

const lessonsSchema= mongoose.Schema({
    name:{
        type:String,
      unique:true  
    },
    image:String,
    content:{
        type:String
    },
    words:Number,
    lang:{
        type:String
    },
    pages:Number,
    topic:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Topic"
    },


},{
    timestamps:true,
})

const LessonsModel=mongoose.model("Lessons",lessonsSchema);
module.exports=LessonsModel;
