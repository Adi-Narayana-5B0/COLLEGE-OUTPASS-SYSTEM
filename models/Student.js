const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  name: String,
  rollNumber: String,
  password: String,
  branch: String,
  year: Number
});

module.exports = mongoose.model("Student", studentSchema);
