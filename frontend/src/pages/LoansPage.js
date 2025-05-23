"use client"

import { useState, useEffect } from "react"
import { useLocation } from "react-router-dom"
import LoanCard from "../components/LoanCard"
import LoanDetails from "../components/LoanDetails"
import LoanComparison from "../components/LoanComparison"
import "./LoansPage.css"

const LoansPage = () => {
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)

  const [loans, setLoans] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedLoan, setSelectedLoan] = useState(null)
  const [showComparison, setShowComparison] = useState(false)
  const [loansToCompare, setLoansToCompare] = useState([])

  // Get filter parameters from URL
  const amount = queryParams.get("amount")
  const maxInterest = queryParams.get("maxInterest")
  const collateral = queryParams.get("collateral")

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        setLoading(true)

        // Construct the filter URL with query parameters
        const filterUrl =  `http://localhost:5000/api/loans/filter?amount=${amount}&max_interest=${maxInterest}&collateral=${collateral}`

        // Make the actual API call
        const response = await fetch(filterUrl)

        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`)
        }

        const data = await response.json()
        setLoans(data)
        setLoading(false)
      } catch (err) {
        setError("Failed to fetch loans. Please try again later.")
        setLoading(false)
        console.error("Error fetching loans:", err)
      }
    }

    fetchLoans()
  }, [amount, maxInterest, collateral])

  const handleLoanClick = (loan) => {
    setSelectedLoan(loan)
  }

  const handleCloseDetails = () => {
    setSelectedLoan(null)
  }

  const toggleLoanComparison = (loan) => {
    if (loansToCompare.some((l) => l.id === loan.id)) {
      setLoansToCompare(loansToCompare.filter((l) => l.id !== loan.id))
    } else {
      if (loansToCompare.length < 3) {
        setLoansToCompare([...loansToCompare, loan])
      } else {
        alert("You can compare up to 3 loans at a time")
      }
    }
  }

  const handleCompareClick = () => {
    if (loansToCompare.length < 2) {
      alert("Please select at least 2 loans to compare")
    } else {
      setShowComparison(true)
    }
  }

  const handleCloseComparison = () => {
    setShowComparison(false)
  }

  return (
    <div className="loans-page">
      <div className="loans-header">
        <h1 className="page-title">Available Education Loans</h1>
        <p className="filter-info">
          Based on your Requirements: ₹{amount}, max interest: {maxInterest}%
        </p>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="loader"></div>
          <p>Loading available loans...</p>
        </div>
      ) : error ? (
        <div className="error-container">
          <p className="error-message">{error}</p>
          <button className="btn btn-primary" onClick={() => (window.location.href = "/")}>
            Go Back
          </button>
        </div>
      ) : (
        <>
          {loans.length === 0 ? (
            <div className="no-loans-container">
              <p>No loans match your criteria. Please try different parameters.</p>
              <button className="btn btn-primary" onClick={() => (window.location.href = "/")}>
                Go Back
              </button>
            </div>
          ) : (
            <>
              <div className="comparison-controls">
                <p>Select loans to compare: {loansToCompare.length} selected</p>
                <button className="loanbutton" onClick={handleCompareClick} disabled={loansToCompare.length < 2}>
                  Compare Selected Loans
                </button>
              </div>

              <div className="loans-grid">
                {loans.map((loan) => (
                  <LoanCard
                    key={loan.id}
                    loan={loan}
                    onClick={() => handleLoanClick(loan)}
                    onCompareToggle={() => toggleLoanComparison(loan)}
                    isSelected={loansToCompare.some((l) => l.id === loan.id)}
                  />
                ))}
              </div>
            </>
          )}
        </>
      )}

      {selectedLoan && <LoanDetails loan={selectedLoan} onClose={handleCloseDetails} />}

      {showComparison && <LoanComparison loans={loansToCompare} onClose={handleCloseComparison} />}
    </div>
  )
}

export default LoansPage
