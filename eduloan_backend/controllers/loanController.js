const Loan = require('../Models/loanmodel');

// Add new loan
exports.addLoan = async (req, res) => {
  try {
    const loan = new Loan(req.body);
    await loan.save();
    res.status(201).json({ message: 'Loan added successfully', loan });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Filter loans based on user criteria
exports.filterLoans = async (req, res) => {
  try {
    const { amount, max_interest, collateral } = req.query;
    const filter = {};

    // Apply filters
    if (amount) {
      filter.loan_amount_min = { $lte: Number(amount) };
      filter.loan_amount_max = { $gte: Number(amount) };
    }
    if (max_interest) {
      filter.interest_rate = { $lte: Number(max_interest) };
    }
    if (collateral && (collateral === 'Yes' || collateral === 'No')) {
      filter.collateral_required = collateral;
    }

    const loans = await Loan.find(filter);

    // Remove duplicates by loan_name
    const uniqueLoansMap = new Map();
   // ...existing code...
loans.forEach((loan) => {
  if (!uniqueLoansMap.has(loan.loan_name)) {
    uniqueLoansMap.set(loan.loan_name, {
      id: loan._id,
      bank_name: loan.bank_name,
      loan_name: loan.loan_name,
      loan_type: loan.loan_type,
      interest_rate: loan.interest_rate,
      eligibility: loan.eligibility,
      loan_amount_min: loan.loan_amount_min,
      loan_amount_max: loan.loan_amount_max,
      collateral_required: loan.collateral_required,
      processing_fee: loan.processing_fee,
      moratorium_period_months: loan.moratorium_period_months,
      min_repayment_duration_years: loan.min_repayment_duration_years,
      max_repayment_duration_years: loan.max_repayment_duration_years,
      concessions: loan.concessions,
      additional_notes: loan.additional_notes,
    });
  }
});
// ...existing code...

    const response = Array.from(uniqueLoansMap.values());
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get loan by ID (for details or comparison)
exports.getLoanById = async (req, res) => {
  try {
    const loan = await Loan.findById(req.params.id);
    if (!loan) return res.status(404).json({ message: 'Loan not found' });
    res.json(loan);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
