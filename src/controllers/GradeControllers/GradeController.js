const gradeModel = require("../../models/Grade/grade.models");
const asyncHandler = require("../../utils/asyncHandler");



exports.addGrade = asyncHandler(async (req, res) => {
    const { gradeNumber, gradeStudents, gradeTeachers, gradeSubjects } = req.body;
    try {
        const savegrade = new gradeModel({
            gradeNumber,
            gradeStudents,
            gradeSubjects,
            gradeTeachers
        });
        const uniqueSubjectIds = new Set();
        for (const subject of gradeSubjects) {
         
            if (subject && subject.subjectId) {
                uniqueSubjectIds.add(subject.subjectId);
            }
        }
        const uniqueSubjectArray = Array.from(uniqueSubjectIds);
        savegrade.gradeSubjects = uniqueSubjectArray.map(subjectId => ({ subjectId }));

        await savegrade.save();
        res.status(200).json({ savegrade });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


