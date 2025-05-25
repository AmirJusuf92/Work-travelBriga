const express = require("express");
const { isAdmin } = require("../middleware/authMiddleware");
const db = require("../config/db");
const router = express.Router();
const ejsLayouts = require("express-ejs-layouts");
const engine = require('ejs-mate');
const app = express();


// Admin Dashboard
router.get("/admin_dash", isAdmin, (req, res) => {
  db.query(`
    SELECT files.*, users.first_name, users.last_name 
    FROM files 
    JOIN users ON files.user_id = users.id 
    ORDER BY users.first_name, users.last_name`, 
    (err, files) => {
      db.query("SELECT * FROM users WHERE role = 'user'", (err, users) => {
        res.render("admin_dash", { admin: req.session.user, users, files });
      });
  });
});
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
router.get('/aplication', (req, res) => {
  db.query(`SELECT applications.*, jobs.title FROM applications 
            JOIN jobs ON applications.job_id = jobs.id ORDER BY applied_at DESC`, (err, results) => {
      if (err) throw err;
      res.render('aplication', { applications: results });
  });
});


module.exports = router;
