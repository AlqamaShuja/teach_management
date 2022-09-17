const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const teacherSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minLength: 3,
        maxLength: 30,
        lowercase: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    courses: {
        type: Array,
        required: true
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
}, {
    timestamps: true
});


teacherSchema.virtual("students", {
    ref: "Student",
    localField: "_id",
    foreignField: "belongTo"
});



teacherSchema.methods.toJSON = function(){
    const teacher = this;
    const teacherObject = teacher.toObject();
    delete teacherObject.password;
    delete teacherObject.tokens;
    return teacherObject;
}


teacherSchema.methods.generateAuthToken = async function(){
    const teacher = this;
    const token = jwt.sign({ _id: teacher._id.toString() }, "TeachingIsGood");
    teacher.tokens = teacher.tokens.concat({ token });
    await teacher.save();
    return token;
}


teacherSchema.statics.findByCredentials = async (email, password) => {
    const teacher = await Teacher.findOne({ email });
    if(!teacher) {
        throw new Error("Teacher not Found");
    }
    const isMatch = await bcrypt.compare(password, teacher.password);
    if(!isMatch){
        throw new Error("Credentials does not match");
    }
    return teacher;
}


teacherSchema.pre("save", async function(next){
    const teacher = this;
    if(teacher.isModified("password")){
        teacher.password = await bcrypt.hash(teacher.password, 8);
    }
    next();
});



const Teacher = mongoose.model("Teacher", teacherSchema);
module.exports = Teacher;