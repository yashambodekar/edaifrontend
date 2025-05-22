"use client"

import { useState } from "react"
import EmiCalculator from "./EmiCalculator"
import LoanApprovalPredictor from "./LoanApprovalPredictor"
import "./LoanDetails.css"

const LoanDetails = ({ loan, onClose }) => {
  const [activeTab, setActiveTab] = useState("details")

  // Add this function inside the LoanDetails component
  const fetchLoanDetails = async (loanId) => {
    try {
      const response = await fetch(`https://192.168.247.86/api/loans/${loanId}`)
      console.log(response.json())

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error("Error fetching loan details:", error)
      return null
    }
  }

  return (
    <div className="loan-details-overlay">
      <div className="loan-details-modal">
        <div className="loan-details-header">
          <h2>{loan.loan_name}</h2>
          <button className="close-btn" onClick={onClose}>
            &times;
          </button>
        </div>

        <div className="loan-details-tabs">
          <button
            className={`tab-btn ${activeTab === "details" ? "active" : ""}`}
            onClick={() => setActiveTab("details")}
          >
            Loan Details
          </button>
          <button className={`tab-btn ${activeTab === "emi" ? "active" : ""}`} onClick={() => setActiveTab("emi")}>
            EMI Calculator
          </button>
          <button
            className={`tab-btn ${activeTab === "approval" ? "active" : ""}`}
            onClick={() => setActiveTab("approval")}
          >
            Approval Predictor
          </button>
        </div>

        <div className="loan-details-content">
          {activeTab === "details" && (
            <div className="loan-details-info">
              <div className="loan-detail-row">
                <div className="detail-item">
                  <h4>Bank Name</h4>
                  <p>{loan.bank_name}</p>
                </div>
                <div className="detail-item">
                  <h4>Loan Type</h4>
                  <p>{loan.loan_type}</p>
                </div>
              </div>

              <div className="loan-detail-row">
                <div className="detail-item">
                  <h4>Interest Rate</h4>
                  <p>{loan.interest_rate}%</p>
                </div>
                <div className="detail-item">
                  <h4>Loan Amount Range</h4>
                  <p>
                    ₹{loan.loan_amount_min.toLocaleString()} - ₹{loan.loan_amount_max.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="loan-detail-row">
                <div className="detail-item">
                  <h4>Collateral Required</h4>
                  <p>{loan.collateral_required}</p>
                </div>
                <div className="detail-item">
                  <h4>Processing Fee</h4>
                  <p>{loan.processing_fee}</p>
                </div>
              </div>

              <div className="loan-detail-row">
                <div className="detail-item">
                  <h4>Moratorium Period</h4>
                  <p>{loan.moratorium_period_months} months</p>
                </div>
                <div className="detail-item">
                  <h4>Repayment Duration</h4>
                  <p>
                    {loan.min_repayment_duration_years} - {loan.max_repayment_duration_years} years
                  </p>
                </div>
              </div>

              <div className="loan-detail-row">
                <div className="detail-item full-width">
                  <h4>Eligibility</h4>
                  <p>{loan.eligibility}</p>
                </div>
              </div>

              {loan.concessions && (
                <div className="loan-detail-row">
                  <div className="detail-item full-width">
                    <h4>Concessions</h4>
                    <p>{loan.concessions}</p>
                  </div>
                </div>
              )}

              {loan.additional_notes && (
                <div className="loan-detail-row">
                  <div className="detail-item full-width">
                    <h4>Additional Notes</h4>
                    <p>{loan.additional_notes}</p>
                  </div>
                </div>
              )}

              <div className="loan-detail-actions">
                <a
                  href={`https://${loan.bank_name.toLowerCase().replace(/\s+/g, "")}.com/education-loan`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                >
                  Apply for Loan
                </a>
              </div>
            </div>
          )}

          {activeTab === "emi" && (
            <EmiCalculator
              loanInterestRate={loan.interest_rate}
              maxAmount={loan.loan_amount_max}
              minAmount={loan.loan_amount_min}
              maxDuration={loan.max_repayment_duration_years}
              loanId={loan.id || loan._id} // Make sure this is a valid MongoDB ObjectId or your loan's unique id
            />
          )}

          {activeTab === "approval" && <LoanApprovalPredictor bankName={loan.bank_name} />}
        </div>
      </div>
    </div>
  )
}

export default LoanDetails
