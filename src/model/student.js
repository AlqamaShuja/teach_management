const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const studentSchema = new mongoose.Schema({
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
    belongTo: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Teacher"
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

studentSchema.methods.toJSON = function(){
    const student = this;
    const studentObject = student.toObject();
    delete studentObject.password;
    delete studentObject.tokens;
    return studentObject;
}


studentSchema.methods.generateAuthToken = async function(){
    const student = this;
    const token = jwt.sign({ _id: student._id.toString() }, "TeachingIsGood");
    student.tokens = student.tokens.concat({ token });
    await student.save();
    return token;
}


studentSchema.statics.findByCredentials = async (email, password) => {
    const student = await Student.findOne({ email });
    if(!student) {
        throw new Error("student not Found");
    }
    const isMatch = await bcrypt.compare(password, student.password);
    if(!isMatch){
        throw new Error("Credentials does not match");
    }
    return student;
}


studentSchema.pre("save", async function(next){
    const student = this;
    if(student.isModified("password")){
        student.password = await bcrypt.hash(student.password, 8);
    }
    next();
});



const Student = mongoose.model("Student", studentSchema);
module.exports = Student;