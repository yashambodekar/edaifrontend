const express = require('express');
const router = express.Router();
const loanController = require('../controllers/loanController');
const emiController = require('../controllers/emiController');

// Add new loan
router.post('/add', loanController.addLoan);

// Filter loans
router.get('/filter', loanController.filterLoans);

// Get loan details by id
router.get('/:id', loanController.getLoanById);

// Calculate EMI
router.post('/calculate-emi', emiController.calculateEMI);
//gernerate the pdf 
router.post('/:id/emi-report-pdf', emiController.downloadEmiPdf);

module.exports = router;