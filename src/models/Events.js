const mongoose=require("mongoose");
const {Schema}=require('mongoose');

const EventSchema=new Schema({
    eventName:{
        type:String
    }
})

const EventModel= mongoose.model("upcomingEvents",EventSchema);
module.exports=EventModel;
