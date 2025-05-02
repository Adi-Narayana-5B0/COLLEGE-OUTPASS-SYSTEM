const express = require("express");
const router = express.Router();
const Student = require("../models/Student");
const Request = require("../models/Request");

// Register
router.post("/register", async (req, res) => {
  const { name, rollNumber, password, branch, year } = req.body;
  try {
    const existingStudent = await Student.findOne({ rollNumber });
    if (existingStudent) {
      return res.send("Student already registered");
    }
    await Student.create({ name, rollNumber, password, branch, year });
    res.redirect("/student/login");
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).send("Server error");
  }
});

// Login
router.post("/login", async (req, res) => {
  const { rollNumber, password } = req.body;
  try {
    const student = await Student.findOne({ rollNumber, password });
    if (student) {
      const requests = await Request.find({ rollNumber }).sort({ createdAt: -1 });
      res.render("studentDashboard", { student, requests });
    } else {
      res.render("studentLogin", { error: "Invalid roll number or password" });
    }
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).send("Server error");
  }
});


// Submit Outpass Request
router.post("/request", async (req, res) => {
  const { rollNumber, reason, date, time } = req.body;
  try {
    const student = await Student.findOne({ rollNumber }); // ← fetch the student
    if (!student) return res.status(404).send("Student not found");

    await Request.create({
      name: student.name,            // ← now reliably includes the name
      rollNumber,
      reason,
      date,
      time,
      status: "Pending",
      hodStatus: "Pending",
      principalStatus: "Pending"
    });

    const requests = await Request.find({ rollNumber }).sort({ createdAt: -1 });
    res.render("studentDashboard", { student, requests });
  } catch (error) {
    console.error("Request submission error:", error);
    res.status(500).send("Server error");
  }
});


module.exports = router;
