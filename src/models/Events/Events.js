const mongoose=require('mongoose');
const { schema } = require('../StudentModel/student');

const {Schema}=require(mongoose);

const EventSchema=new Schema({
    eventName:{
        type:String,
        
    },
  
},{
    timestamps:true,
})

const   EventModel=mongoose.model("upcomingEvents",FeedbackSchema);
module.exports=EventModel;