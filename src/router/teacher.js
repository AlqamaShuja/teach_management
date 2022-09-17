const router = require("express").Router();
const Teacher = require("../model/teacher");
const teacherAuth = require("../middleware/teacherAuth");


router.get("/teachers/me", teacherAuth, (req, res) => {
    if(req.error){
        return res.status(400).send({ error: req.error.message });
    }
    res.send({ teacher: req.teacher, token: req.token });
}, (error, req, res, next) => {
    if(error){
        return res.status(400).send({ error });
    }
});

router.post("/teachers", async (req, res) => {
    try {
        const teacher = Teacher(req.body);
        const token = await teacher.generateAuthToken();
        await teacher.save();
        res.status(201).send({ teacher, token });    
    } catch (error) {
        res.status(500).send(error);
    }
});

router.post("/teachers/login", async (req, res) => {
   try {
        const teacher = await Teacher.findByCredentials(req.body.email, req.body.password);
        const token = await teacher.generateAuthToken();
        res.status(200).send({ teacher, token });
   } catch (error) {
        res.status(500).send(error);
   }
});

router.patch("/teachers/me", teacherAuth, async (req, res) => {
    if(req.error){
        return res.status(400).send(req.error)
    }
   const updatedValue = Object.keys(req.body);
   const allowUpdate = ["name", "email", "password", "age", "courses"];
   const isValidUpdate = updatedValue.every(value => allowUpdate.includes(value));
   if(!isValidUpdate){
    return res.status(400).send({ error: "Invalid Update" });
   }
   try{
        updatedValue.forEach(key => req.teacher[key] = req.body[key]);
        await req.teacher.save();
        res.status(200).send(req.teacher);
   }
   catch(e){
       res.status(500).send({ error: e.message });
   }
});

router.delete("/teachers/me", teacherAuth, async (req, res) => {
    if(req.error){
        return res.status(401).send(req.error);
    }
    try {
        await req.teacher.delete();
        res.status(200).send({ message: "teacher profile has been deleted Successfully" });
    } catch (error) {
        res.status(error);
    }
});

router.get("/teachers/students", teacherAuth, async (req, res) => {
    await req.teacher.populate("students");
    res.status(200).send(req.teacher.students);
});



module.exports = router;