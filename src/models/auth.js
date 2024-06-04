const mongoose = require("mongoose");
const { Schema } = require("mongoose");

// ######################## Topic Schema #####################
const AuthSchema = new Schema(
  {
    fullName:{type:String},
    userName:{type:String,unique:true},
    email:{type:String,unique:true},

    password:{type:String},
    userType:{
        type:String,
        enum:["Admin","Teacher","Student","Parent"],
    },
    profile:{
        type: mongoose.Schema.Types.ObjectId,
        userRef:"userType"
    },
    image:String,
    fullAddress:String,
    otp:String


  },
  {
    timestamps: true,
  }
);

const authModel = mongoose.model("auth", AuthSchema);
module.exports = authModel;
