const express = require('express');
const router = express.Router();
const Request = require('../models/Request');

// GET: Login page
router.get('/login', (req, res) => {
  res.render('principalLogin');
});

// POST: Login (hardcoded)
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'principal' && password === 'admin123') {
    req.session.principal = true;
    res.redirect('/principal/dashboard');
  } else {
    res.send('Invalid credentials');
  }
});

// GET: Dashboard - only requests forwarded by HOD
router.get('/dashboard', async (req, res) => {
    if (!req.session.principal) return res.redirect('/principal/login');
  
    try {
      const requests = await Request.find({
        status: { $in: ['Forwarded', 'Principal Approved', 'Principal Rejected'] },
      });
  
      res.render('principalDashboard', { requests });
  
    } catch (error) {
      console.error('Error fetching principal dashboard:', error);
      res.status(500).send("Error loading dashboard. Please try again.");
    }
  });
  

// POST: Update principal decision
router.post('/update', async (req, res) => {
  try {
    const { id, status } = req.body;

    if (!id || !status) {
      return res.status(400).send('Missing request ID or status');
    }

    const principalStatus = status; // e.g., 'Approved' or 'Rejected'

    // Derive overall status for clarity
    let overallStatus = '';
    if (status === 'Approved') overallStatus = 'Principal Approved';
    else if (status === 'Rejected') overallStatus = 'Principal Rejected';

    await Request.findByIdAndUpdate(id, {
      principalStatus,
      status: overallStatus,
    });

    res.redirect('/principal/dashboard');
  } catch (err) {
    console.error('Error updating request:', err);
    res.status(500).send('Internal server error');
  }
});

module.exports = router;
