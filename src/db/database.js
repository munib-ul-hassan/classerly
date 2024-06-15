const mongoose=require('mongoose');
const mongo_uri=process.env.MONGO_URI
const { DB_NAME } = require('../constants');



 const  ConnectDB=(async()=>{
  await  mongoose.connect(`${mongo_uri}`,{ useNewUrlParser: true, useUnifiedTopology: true }).then(()=>{
        console.log("datbase conneced Successfuly")
    }).catch((error)=>{
        console.log('error in connecting databse',error)
    })

})

module.exports=ConnectDB;