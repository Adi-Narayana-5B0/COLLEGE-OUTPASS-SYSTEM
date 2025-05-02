const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema({
  name: String,
  rollNumber: String,
  reason: String,
  date: String,
  time: String,
  status: { type: String, default: "Pending" }, // "Pending", "Forwarded", "Rejected", "Approved"
  hodStatus: { type: String, default: "Pending" }, // "Pending", "Forwarded", "Rejected"
  principalStatus: { type: String, default: "Pending" }, // "Pending", "Approved", "Rejected"
});

module.exports = mongoose.model("Request", requestSchema);
