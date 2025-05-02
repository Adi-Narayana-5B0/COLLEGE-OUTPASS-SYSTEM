const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const principalRoutes = require('./routes/principal');

dotenv.config();
const app = express();
const session = require('express-session');

app.use(session({
  secret: 'adi',  // Use a strong secret in production
  resave: false,
  saveUninitialized: true,
}));


app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// Home Page
app.get("/", (req, res) => {
  res.render("index"); // views/index.ejs
});

// Render Student Login Page
app.get("/student/login", (req, res) => {
  res.render("studentLogin"); // views/studentLogin.ejs
});

// Render Student Register Page
app.get("/student/register", (req, res) => {
  res.render("studentRegister"); // views/studentRegister.ejs
});

// Render HOD Login Page
app.get("/hod/login", (req, res) => {
  res.render("hodLogin"); // views/hodLogin.ejs
});
// Render HOD Login Page
app.get("/principal/login", (req, res) => {
  res.render("principalLogin"); // views/hodLogin.ejs
});
// Routes
app.use("/student", require("./routes/student"));
app.use("/hod", require("./routes/hod"));
app.use('/principal', principalRoutes);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on http://localhost:${PORT}`));

