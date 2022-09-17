require("./db/mongoose");
const express = require("express");


const app = express();

// Router Import
const teacherRoute = require("./router/teacher");
const studentRoute = require("./router/student");

// Middleware
app.use(express.json());

// Router Middleware
app.use(teacherRoute);
app.use(studentRoute)


const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log("Server is running on port " + port);
})