const PDFDocument = require('pdfkit');
const Loan = require('../Models/loanmodel');

exports.downloadEmiPdf = async (req, res) => {
  try {
    const { loanAmount, interestRate, repaymentYears } = req.body;
    const loanId = req.params.id;

    // Validate input
    if (!loanAmount || !interestRate || !repaymentYears) {
      return res.status(400).json({ message: 'Missing required input values' });
    }

    // Fetch loan details using ID
    const loan = await Loan.findById(loanId);
    if (!loan) {
      return res.status(404).json({ message: 'Loan not found' });
    }

    const loanName = loan.loan_name || 'N/A';
    const loanType = loan.loan_type || 'N/A';
    const bank = loan.bank_name||'N/A';

    // EMI Calculation
    const P = parseFloat(loanAmount);
    const R = parseFloat(interestRate) / 12 / 100;
    const N = parseFloat(repaymentYears) * 12;

    let EMI = R === 0 ? P / N : (P * R * Math.pow(1 + R, N)) / (Math.pow(1 + R, N) - 1);
    EMI = parseFloat(EMI.toFixed(2));
    const totalPayment = parseFloat((EMI * N).toFixed(2));
    const totalInterest = parseFloat((totalPayment - P).toFixed(2));

    // Generate PDF
    console.log('Hit PDF download route:', req.params.id);

    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=emi_report_${loanName.replace(/\s+/g, '_')}.pdf`);
    doc.pipe(res);

    doc.fontSize(20).text(' EMI Calculation Report', { underline: true });
    doc.moveDown();
    doc.fontSize(14).text(`Bank : ${bank}`);
    doc.moveDown();
    doc.fontSize(14).text(`Loan Name: ${loanName}`);
    doc.text(`Loan Type: ${loanType}`);
    doc.moveDown();
    doc.text(`Loan Amount: ${loanAmount}`);
    doc.text(`Interest Rate: ${interestRate}%`);
    doc.text(`Tenure: ${repaymentYears} years`);
    doc.moveDown();
    doc.text(`Monthly EMI: ${EMI}`);
    doc.text(`Total Interest: ${totalInterest}`);
    doc.text(`Total Repayment: ${totalPayment}`);

    doc.end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.calculateEMI = (req, res) => {
  try {
    const { loanAmount, interestRate, repaymentYears } = req.body;

    if (
      !loanAmount ||
      !interestRate ||
      !repaymentYears ||
      loanAmount <= 0 ||
      interestRate < 0 ||
      repaymentYears <= 0
    ) {
      return res.status(400).json({ message: 'Invalid input values' });
    }

    const P = parseFloat(loanAmount);
    const R = parseFloat(interestRate) / 12 / 100;
    const N = parseFloat(repaymentYears) * 12;

    let EMI;

    if (R === 0) {
      EMI = P / N;
    } else {
      EMI = (P * R * Math.pow(1 + R, N)) / (Math.pow(1 + R, N) - 1);
    }

    EMI = parseFloat(EMI.toFixed(2));
    const totalPayment = parseFloat((EMI * N).toFixed(2));
    const totalInterest = parseFloat((totalPayment - P).toFixed(2));

    res.json({
      monthlyEMI: EMI,
      totalInterest,
      totalPayment
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};