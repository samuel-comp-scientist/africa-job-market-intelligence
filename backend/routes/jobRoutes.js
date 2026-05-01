const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');
const auth = require('../middleware/auth');

// Public routes
router.get('/', jobController.getAllJobs);
router.get('/search', jobController.searchJobs);
router.get('/stats', jobController.getJobStats);
router.get('/skills/top', jobController.getTopSkills);
router.get('/country/:country', jobController.getJobsByCountry);
router.get('/skill/:skill', jobController.getJobsBySkill);
router.get('/:id', jobController.getJobById);

// Protected routes (require authentication)
router.post('/scrape', auth, jobController.scrapeJobs);

// Admin routes (require admin privileges)
router.delete('/:id', auth, jobController.deleteJob);
router.patch('/:id/status', auth, jobController.updateJobStatus);

module.exports = router;
