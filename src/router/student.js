const router = require("express").Router();
const teacherAuth = require("../middleware/teacherAuth");
const Student = require("../model/student");

router.get("/students/me", teacherAuth, (req, res) => {
    res.send("Students");
});

router.post("/students", teacherAuth, async (req, res) => {
    if(req.error){
        return res.status(401).send(req.error);
    }
    try {
        const std = new Student({
            ...req.body,
            belongTo: req.teacher._id
        });
        await std.save();
        res.status(201).send(std);
    } catch (error) {
        res.status(500).send(error);
    }
});


module.exports = router;