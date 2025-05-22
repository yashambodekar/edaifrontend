"use client"
import "./LoanCard.css"

const LoanCard = ({ loan, onClick, onCompareToggle, isSelected }) => {
  return (
    <div className={`loan-card ${isSelected ? "selected" : ""}`}>
      <div className="loan-card-header">
        <h3 className="loan-name">{loan.loan_name}</h3>
        <p className="bank-name">{loan.bank_name}</p>
      </div>
      <div className="loan-card-body">
        <div className="loan-info-item">
          <span className="info-label">Interest Rate:</span>
          <span className="info-value">{loan.interest_rate}%</span>
        </div>
        <div className="loan-info-item">
          <span className="info-label">Loan Amount:</span>
          <span className="info-value">
            ₹{loan.loan_amount_min.toLocaleString()} - ₹{loan.loan_amount_max.toLocaleString()}
          </span>
        </div>
        <div className="loan-info-item">
          <span className="info-label">Collateral:</span>
          <span className="info-value">{loan.collateral_required}</span>
        </div>
      </div>
      <div className="loan-card-footer">
        <button className="btn btn-primary view-details-btn" onClick={onClick}>
          View Details
        </button>
        <div className="compare-checkbox">
          <input type="checkbox" id={`compare-${loan.id}`} checked={isSelected} onChange={onCompareToggle} />
          <label htmlFor={`compare-${loan.id}`}>Compare</label>
        </div>
      </div>
    </div>
  )
}

export default LoanCard
