"use client"
import "./LoanComparison.css"

const LoanComparison = ({ loans, onClose }) => {
  // Function to determine the best loan based on different criteria
  const getBestLoan = (criteria) => {
    if (loans.length === 0) return null

    switch (criteria) {
      case "interestRate":
        return loans.reduce((prev, current) => (prev.interest_rate < current.interest_rate ? prev : current))
      case "loanAmount":
        return loans.reduce((prev, current) => (prev.loan_amount_max > current.loan_amount_max ? prev : current))
      case "moratorium":
        return loans.reduce((prev, current) =>
          prev.moratorium_period_months > current.moratorium_period_months ? prev : current,
        )
      case "repayment":
        return loans.reduce((prev, current) =>
          prev.max_repayment_duration_years > current.max_repayment_duration_years ? prev : current,
        )
      case "overall":
        // Calculate a score for each loan (lower is better)
        const scoredLoans = loans.map((loan) => {
          // Normalize each factor to a 0-1 scale and weight them
          const interestScore = (loan.interest_rate / 15) * 0.4 // Higher weight for interest rate
          const amountScore = (1 - loan.loan_amount_max / 10000000) * 0.3
          const moratoriumScore = (1 - loan.moratorium_period_months / 24) * 0.15
          const repaymentScore = (1 - loan.max_repayment_duration_years / 20) * 0.15

          return {
            ...loan,
            score: interestScore + amountScore + moratoriumScore + repaymentScore,
          }
        })

        return scoredLoans.reduce((prev, current) => (prev.score < current.score ? prev : current))
      default:
        return null
    }
  }

  // Get best loans for each criteria
  const bestInterestRate = getBestLoan("interestRate")
  const bestLoanAmount = getBestLoan("loanAmount")
  const bestMoratorium = getBestLoan("moratorium")
  const bestRepayment = getBestLoan("repayment")
  const overallBest = getBestLoan("overall")

  return (
    <div className="loan-comparison-overlay">
      <div className="loan-comparison-modal">
        <div className="loan-comparison-header">
          <h2>Loan Comparison</h2>
          <button className="close-btn" onClick={onClose}>
            &times;
          </button>
        </div>

        <div className="loan-comparison-content">
          <div className="comparison-table-container">
            <table className="comparison-table">
              <thead>
                <tr>
                  <th>Feature</th>
                  {loans.map((loan) => (
                    <th key={loan.id}>
                      {loan.loan_name}
                      {loan.id === overallBest.id && <span className="best-overall-badge">Best Overall</span>}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Bank</td>
                  {loans.map((loan) => (
                    <td key={loan.id}>{loan.bank_name}</td>
                  ))}
                </tr>
                <tr>
                  <td>
                    Interest Rate
                    {bestInterestRate && <span className="best-feature-badge">Best</span>}
                  </td>
                  {loans.map((loan) => (
                    <td key={loan.id} className={loan.id === bestInterestRate?.id ? "best-feature" : ""}>
                      {loan.interest_rate}%
                    </td>
                  ))}
                </tr>
                <tr>
                  <td>
                    Maximum Loan Amount
                    {bestLoanAmount && <span className="best-feature-badge">Best</span>}
                  </td>
                  {loans.map((loan) => (
                    <td key={loan.id} className={loan.id === bestLoanAmount?.id ? "best-feature" : ""}>
                      ₹{loan.loan_amount_max.toLocaleString()}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td>
                    Moratorium Period
                    {bestMoratorium && <span className="best-feature-badge">Best</span>}
                  </td>
                  {loans.map((loan) => (
                    <td key={loan.id} className={loan.id === bestMoratorium?.id ? "best-feature" : ""}>
                      {loan.moratorium_period_months} months
                    </td>
                  ))}
                </tr>
                <tr>
                  <td>
                    Maximum Repayment Duration
                    {bestRepayment && <span className="best-feature-badge">Best</span>}
                  </td>
                  {loans.map((loan) => (
                    <td key={loan.id} className={loan.id === bestRepayment?.id ? "best-feature" : ""}>
                      {loan.max_repayment_duration_years} years
                    </td>
                  ))}
                </tr>
                <tr>
                  <td>Collateral Required</td>
                  {loans.map((loan) => (
                    <td key={loan.id}>{loan.collateral_required}</td>
                  ))}
                </tr>
                <tr>
                  <td>Processing Fee</td>
                  {loans.map((loan) => (
                    <td key={loan.id}>{loan.processing_fee}</td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>

          <div className="comparison-summary">
            <h3>Comparison Summary</h3>
            <ul className="summary-list">
              <li>
                <strong>Best Interest Rate:</strong> {bestInterestRate?.loan_name} ({bestInterestRate?.interest_rate}%)
              </li>
              <li>
                <strong>Highest Loan Amount:</strong> {bestLoanAmount?.loan_name} (₹
                {bestLoanAmount?.loan_amount_max.toLocaleString()})
              </li>
              <li>
                <strong>Longest Moratorium Period:</strong> {bestMoratorium?.loan_name} (
                {bestMoratorium?.moratorium_period_months} months)
              </li>
              <li>
                <strong>Longest Repayment Duration:</strong> {bestRepayment?.loan_name} (
                {bestRepayment?.max_repayment_duration_years} years)
              </li>
            </ul>

            <div className="overall-recommendation">
              <h3>Overall Best Recommendation</h3>
              <div className="recommendation-card">
                <h4>{overallBest?.loan_name}</h4>
                <p className="recommendation-bank">{overallBest?.bank_name}</p>
                <ul className="recommendation-features">
                  <li>Interest Rate: {overallBest?.interest_rate}%</li>
                  <li>Maximum Loan: ₹{overallBest?.loan_amount_max.toLocaleString()}</li>
                  <li>Moratorium: {overallBest?.moratorium_period_months} months</li>
                  <li>Repayment: Up to {overallBest?.max_repayment_duration_years} years</li>
                </ul>
                <a
                  href={`https://${overallBest?.bank_name.toLowerCase().replace(/\s+/g, "")}.com/education-loan`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary apply-btn"
                >
                  Apply for This Loan
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoanComparison
