const jwt = require("jsonwebtoken");
const Teacher = require("../model/teacher");


const teacherAuth = async (req, res, next) => {
    try{
        const token = req.header("Authorization").replace("Bearer ", "");
        const decoded = jwt.verify(token, "TeachingIsGood");
        const teacher = await Teacher.findOne({ _id: decoded._id, token: token });
        if(!teacher){
            throw new Error();
        }
        req.token = token;
        req.teacher = teacher;
    }
    catch(error){
        const err = {
            message: "You are not login yet"
        }
        req.error = err;
    }
    finally{
        next();
    }
    
}


module.exports = teacherAuth;