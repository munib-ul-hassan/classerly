


const ParentModel = require('../../models/Parentmodel/parentmodel');
const StudentModel = require('../../models/StudentModel/student');
const asyncHandler = require('../../utils/asyncHandler');


exports.registerparent = asyncHandler(async (req, res) => {
    try {
        const { fullname, username, password, emailaddress, fulladdress, stdid } = req.body;

      
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
            childIds: [child._id] 
        });

        
        await newParent.save();

        res.status(201).json({ message: "Parent signed up successfully" });
    } catch (error) {
        console.error("Error in sign-up:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});


