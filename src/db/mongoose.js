const mongoose = require("mongoose");
const db_name = "teach_management";
const dbURL = "mongodb://127.0.0.1:27017/" + db_name;

mongoose.connect(dbURL, () => {
    console.log("Database Connected...!!");
});
