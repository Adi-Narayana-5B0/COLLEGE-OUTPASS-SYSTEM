const express = require("express");
const router = express.Router();
const Request = require("../models/Request");

// Default credentials
const HOD_CREDENTIALS = { username: "hod", password: "1234" };

// Login route
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  if (username === HOD_CREDENTIALS.username && password === HOD_CREDENTIALS.password) {
    req.session.hod = true;
    const requests = await Request.find();
    res.render("hodDashboard", { requests });
  } else {
    res.send("Invalid HOD credentials");
  }
});

// GET dashboard route
router.get("/dashboard", async (req, res) => {
  if (!req.session.hod) return res.redirect("/hod/login");
  const requests = await Request.find().sort({ _id: -1 });
  res.render("hodDashboard", { requests });
});

// Update request status
router.post("/update", async (req, res) => {
  const { id, status } = req.body;

  // Only allow Forwarded or Rejected
  if (status === "Forwarded" || status === "Rejected") {
    await Request.findByIdAndUpdate(id, { status });
  }

  res.redirect("/hod/dashboard");
});

module.exports = router;
