
const mongoose = require("mongoose");
const { Schema } = require("mongoose");


const parentSchema = new Schema(
  {
    
    auth:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"auth"
    },
   
    childIds:[
        {
            type: mongoose.Schema.Types.ObjectId,
        ref:"Student"
        }
    ],
    code:String

  },
  {
    timestamps: true,
  }
);

const parentModel = mongoose.model("Parent", parentSchema);
module.exports = parentModel;
