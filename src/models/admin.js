
const mongoose = require("mongoose");
const { Schema } = require("mongoose");


const adminSchema = new Schema(
  {
    
    auth:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"auth"
    },
   
    code:String

  },
  {
    timestamps: true,
  }
);

const adminModel = mongoose.model(" ", adminSchema);
module.exports = adminModel;
