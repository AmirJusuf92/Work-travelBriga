const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Create job (GET + POST)
router.get('/create-job', (req, res) => {
    res.render('create-job');
});

router.post('/create-job', (req, res) => {
    const { title, description, location } = req.body;
    db.query('INSERT INTO jobs (title, description, location) VALUES (?, ?, ?)', [title, description, location], (err) => {
        if (err) throw err;
        res.redirect('jobs');
    });
});

// View applications
router.get('/applications', (req, res) => {
    db.query(`SELECT applications.*, jobs.title FROM applications 
              JOIN jobs ON applications.job_id = jobs.id ORDER BY applied_at DESC`, (err, results) => {
        if (err) throw err;
        res.render('application', { applications: results });
    });
});

module.exports = router;