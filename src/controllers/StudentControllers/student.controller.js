const StudentModel = require('../../models/StudentModel/student.js');
const ApiError = require('../../utils/Apierror.js');
const  asyncHandler = require ('../../utils/asyncHandler.js');
const ApiResponse=require('../../utils/ApiResponse.js')
const jwt=require('jsonwebtoken');
const sendEmail = require('../../utils/sendemail.js');
const gradeModel = require('../../models/Grade/grade.models.js');
const subjectModel = require('../../models/CurriculumModel/subject.js');
const TeacherModel = require('../../models/TeacherModel/teachermodel.js');
const { default: mongoose } = require('mongoose');



const options={
   httpOnly:true,
   secure:true
}

const generateAccessAndRefreshToken=async(studentId)=>{
 
   try {
        const student=await StudentModel.findById(studentId);
    
        const accessToken=student.generateAccessToken();
       
        const refreshToken=student.generateRefreshToken();
        
        student.refreshToken=refreshToken;
        await student.save({validateBeforeSave:false})
        return {accessToken,refreshToken};
     
      
   } catch (error) {
        throw new ApiError(500,"Something went wrong while generating refreshToken and accessToken")
   }
}

exports.registerStudent = asyncHandler(async (req, res) => {
    try {
        const { fullname, username, password, emailaddress, fulladdress } = req.body;
        const gradeId = req.params.id;
        if ([fullname, username, password, emailaddress, fulladdress, gradeId].some(field => !field || field.trim() === "")) {
            throw new ApiError(400, 'All fields are required');
        } else if (emailaddress && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailaddress)) {
            throw new ApiError(400, 'Invalid email address');
        }
 
        const existUser = await StudentModel.findOne({ $or: [{ emailaddress }, { username: username.toLowerCase() }] });
        if (existUser) {
            throw new ApiError(409, 'User already exists');
        }
 
        const generateId = () => {
            return Math.floor(1000000 + Math.random() * 9000000).toString();
        };
 
        const stdid = generateId();
 
        const student = await StudentModel.create({
            fullname,
            username: username.toLowerCase(),
            emailaddress,
            fulladdress,
            password,
            gradeId,
            stdid
        });
      await student.save();
    
          
        if (!student) {
            throw new ApiError(500, 'Something went wrong in creating student');
        }
 
        const createdStudent = await StudentModel.findById(student._id).select("-refreshToken -password");
 
        if (!createdStudent) {
            throw new ApiError(500, 'Something went wrong in creating student');
        }
 
        // Send email after response is sent
        const emailsubject = "Student Registration";
        const email = emailaddress;
        const message = `You are registered successfully. Your student ID is ${student.stdid}.`;
        const requestType = "Your request for student registration is done";
        await sendEmail(emailsubject, email, message, requestType);
 
        // Send response to the client
        res.status(201).json(new ApiResponse(200, createdStudent, "Student account created successfully"));
    } catch (error) {
        const errorMessage = error.message || "Something went wrong";
        return res.status(error.status || 500).json(new ApiResponse(error.status || 500, errorMessage));
    }
 });


 exports.getAllmysubjects = asyncHandler(async (req, res) => {
    const { studentId } = req.body;
    const gradeId = req.params.id;

    try {
        if (!mongoose.isValidObjectId(studentId)) {
            return res.status(400).json({
                message: "Invalid student ID"
            });
        }
        const findstudentSubjects = await StudentModel.findById(studentId).populate("studentSubjects");
        if (!findstudentSubjects) {
            return res.status(500).json({
                message: "Student not found"
            });
        }

        const gradeSubjects = await gradeModel.findById(gradeId).populate({
            path: "gradeSubjects",
            populate: {
                path: "subjectTeacher",
                select: "-password"
            }
        });
        if (!gradeSubjects) {
            return res.status(500).json({
                message: "Grade not found"
            });
        }
        
        // Collect all teachers from gradeSubjects.gradeSubjects
        // const allTeachers = [];
        // for (const subject of gradeSubjects.gradeSubjects) {
        //     console.log(`Teacher for ${subject.subjectname}:`, subject.subjectTeacher);
        //     if (subject.subjectTeacher) {
        //         allTeachers.push(subject.subjectTeacher);
        //     }
        // }

        // Log all teachers for debugging
        // console.log("All Teachers:", allTeachers);

        // Add grade subjects to student subjects if not already present
        for (const subject of gradeSubjects.gradeSubjects) {
            const isPresent = findstudentSubjects.studentSubjects.some(studentSubject => studentSubject._id.equals(subject._id));
            if (!isPresent) {
                findstudentSubjects.studentSubjects.push(subject);
            }
        }

        await findstudentSubjects.save();

        res.status(200).json({
            statusCode: 200,
            gradeSubjects: gradeSubjects.gradeSubjects,
            // teachers: allTeachers,
            message: "Subjects found successfully"
        });
        
    } catch (error) {
        const errorMessage = error.message || "Something went wrong";
        return res.status(error.status || 500).json({
            statusCode: error.status || 500,
            message: errorMessage
        });
    }
});



 
 exports.deleteStudent = asyncHandler(async (req, res) => {
    try {
        const studentId = req.params.id;
        console.log(studentId);
        // Find the student to be deleted
        const student = await StudentModel.findById(studentId);
        console.log(student);
        if (!student) {
            throw new ApiError(404, 'Student not found');
        }

        // Find the grade where the student is registered
        const grade = await gradeModel.findById(student.gradeId);
        console.log("grade students",grade.gradeStudents);
        if (!grade) {
            throw new ApiError(500, 'Grade not found');
        }

        // Remove the student's ID from the gradeStudents array
         console.log("gradestudents",grade.gradeStudents);
         grade.gradeStudents = grade.gradeStudents.filter(student => student._id.toString() !== studentId);
        
        await grade.save();

        // Delete the student
        console.log("Removing student:", student);
        await student.deleteOne();
      res.status(200).json({
        message:"Student Deleted",
        student
      })
       
    } catch (error) {
        const errorMessage = error.message || "Something went wrong";
        return res.status(error.status || 500).json(new ApiResponse(error.status || 500, errorMessage));
    }
});

exports.getallmyTeachers = asyncHandler(async (req, res) => {
    const studentId = req.params.id;
    try {
        const existSubjects = await StudentModel.findById({_id: studentId}).populate("studentSubjects");
        if (!existSubjects) {
            throw new Error("student subjects subjects not found");
        }
         const findteachers=await subjectModel.find().populate("teacherId").select("-password");
         console.log(findteachers);
        console.log(existSubjects);

        res.status(200).json(new ApiResponse(200, existSubjects, "Teachers found successfully"));
    } catch (error) {
        console.error("Error:", error); 
        const errorMessage = error.message || "Something went wrong";
        return res.status(error.status || 500).json(new ApiResponse(error.status || 500, errorMessage));
    }
});










exports.refreshAccessToken=asyncHandler(async(req,res)=>{
 try {
     const incomingRefeshToken=req.cookies.refreshToken || req.body.refreshToken;
     if(!incomingRefeshToken){
        throw ApiError(401,"unathorized access")
     }
     const decodedToken=jwt.verify(incomingRefeshToken,process.env.REFRESH_TOKEN_SECRET);
     const student=StudentModel.findById(decodedToken?._id);
     if(!student){
        throw ApiError(401,"invalid refresh token")
     }
     if(incomingRefeshToken !== StudentModel.refreshToken){
        throw ApiError(401,"refresh token is experied and used")
        
     }
     const {accessToken,newrefreshToken}=await generateAccessAndRefreshToken(student._id)
     return res
     .status(200)
     .cookie("accessToken",accessToken,options)
     .cookie("refreshToken",newrefreshToken,options)
     .json(
        new ApiResponse(
           200,
           {accessToken,refreshToken:newrefreshToken}
        )
     )
 } catch (error) {
  
   
 }
})




