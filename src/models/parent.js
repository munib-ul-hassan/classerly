
const mongoose = require("mongoose");
const { Schema } = require("mongoose");


const parentSchema = new Schema(
  {
    
    auth:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"auth"
    },
    grade:{
      type: mongoose.Schema.Types.ObjectId,
      ref:"grade"
  },
    childIds:[
        {
            type: mongoose.Schema.Types.ObjectId,
        ref:"student"
        }
    ],
    prtId:String

  },
  {
    timestamps: true,
  }
);

const parentModel = mongoose.model("parent", parentSchema);
module.exports = parentModel;
