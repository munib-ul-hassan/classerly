const {Schema} = require("mongoose");
const mongoose = require("mongoose")
const gradeSchema = mongoose.Schema({
    gradeNumber : {
        type : String,
        default : 3
    },
    gradeStudents : [{
        studentId : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Student"
        }
    }],
    gradeTeachers : [{
        teacherId : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Teacher"
        }
    }],
    gradeSubjects : [{
        subjectId : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Subject"
        }
    }]
}, {timestamps : true})

const gradeModel = mongoose.model("Grade", gradeSchema);

module.exports = gradeModel;