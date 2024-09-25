const mongoose = require("mongoose");
const { Schema } = require("mongoose");
const bcrypt=require('bcrypt');
// ######################## Topic Schema #####################
const AuthSchema = new Schema(
  {
    fullName: { type: String },
    userName: { type: String, unique: true },
    email: { type: String, unique: true },
    password: { type: String },
    userType: {
      type: String,
      enum: ["Admin", "Teacher", "Student", "Parent"]
    },
    profile: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "userType"
    },
    image: {type:String,default:""},
    fullAddress: String,
    otp: String,
    emailNotification:{type:Boolean,default:true},
    notification:{type:Boolean,default:true}
  },
  {
    timestamps: true
  }
);
AuthSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  }
});
const authModel = mongoose.model("auth", AuthSchema);
module.exports = authModel;
