
const { json } = require('express');
const ParentModel = require('../../models/Parentmodel/parentmodel');
const StudentModel = require('../../models/StudentModel/student');
const ApiResponse = require('../../utils/ApiResponse');
const asyncHandler = require('../../utils/asyncHandler');
const sendEmail = require('../../utils/sendemail');
const { isValidObjectId } = require('mongoose');


exports.registerparent = asyncHandler(async (req, res) => {
    try {
        const { fullname, username, password, emailaddress, fulladdress, stdid } = req.body;
        if (!fullname || !username || !password || !emailaddress || !fulladdress || !stdid) {
            return res.status(400).json({ error: 'All fields are required' });
          }
      
        const child = await StudentModel.findOne({stdid});
        console.log(child);
        if (!child) {
            return res.status(400).json({ error: "Invalid child ID" });
        }

        const newParent = new ParentModel({
            fullname,
            username,
            password,
            emailaddress,
            fulladdress,
          
        });

        console.log(child._id);
        
        newParent.childIds.push(child._id);
        await newParent.save();
        const emailsubject = "Parent Registration";
        const email = emailaddress;
        const message = `You are registered successfully as Parent`;
        const requestType = "Your request for Parent registration is done";
        await sendEmail(emailsubject, email, message, requestType);

        res.status(201).json( new ApiResponse(200,newParent,"Parent sigup successfully"));
    } catch (error) {
        console.error("Error in sign-up:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

exports.addNewChild=asyncHandler(async(req,res)=>{
      const parentId=req.params.id;
      const {stdid}=req.body;
      if (!isValidObjectId(parentId)) {
        return res.status(400).json({ message: "Invalid parent ID format" });
      }
    try {

         const findParent=await ParentModel.findById({_id:parentId});
         const child = await StudentModel.findOne({stdid});
         console.log(child);
         if (!child) {
             return res.status(400).json({ error: "Invalid child ID" });
         }
        
         findParent.childIds.push(child.id);
         findParent.save();
        console.log(findParent);
         res.status(200).json(
            new ApiResponse(200,findParent,"child added successfully")
         )
        
    } catch (error) {
        console.error("Error in sign-up:", error);
        res.status(500).json({ error: "Internal server error" });
    }
})


exports.getMyChilds=asyncHandler(async(req,res)=>{
    const parentId=req.params.id;
    try {
        const findMychilds=await ParentModel.findById({_id:parentId}).populate({
            path: "childIds", 
            select: "-password"
        });
         
        const childs=findMychilds.childIds;
        res.status(200).json(
            new ApiResponse(200,childs,"childs founded succesfully")
        )
    } catch (error) {
        
    }
})

exports.getDtailofParentChilds=asyncHandler(async(req,res)=>{
       const parentId=req.params.id;
       if (!isValidObjectId(parentId)) {
        return res.status(400).json({ message: "Invalid parent ID format" });
      }
    try {
      
        const findParent = await ParentModel.findById({ _id: parentId }).populate({ 
            path: "childIds", 
            select: "-password" 
          });
        if(!findParent){
            throw new Error("Parent not found");
        }
        const children=findParent.childIds;
        const childId=children.forEach(child=>{
            console.log("child id",child._id)
        })
    
        // const findstudentSubjects = await StudentModel.findById({_id:childId}).populate("studentSubjects");
        // if (!findstudentSubjects) {
        //     return res.status(500).json({
        //         message: "Student not found"
        //     });
        // }
        // const gradeSubjects = await gradeModel.findById({gradeId:child.gradeId}).populate({
        //     path: "gradeSubjects",
        //     populate: {
        //         path: "subjectTeacher",
        //         select: "-password"
        //     }
        // });
        res.status(201).json(
            new ApiResponse(200,children,"Parent Found Successfully")
        )
    } catch (error) {
        res.status(500).json({ message: error.message || "Something went wrong" });
    }
})