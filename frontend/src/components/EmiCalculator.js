"use client"

import { useState, useEffect } from "react"
import "./EmiCalculator.css"

const EmiCalculator = ({
  loanInterestRate = 10,
  maxAmount = 1000000,
  minAmount = 10000,
  maxDuration = 10,
  loanId,
}) => {
  const [formData, setFormData] = useState({
    loanAmount: Math.floor((minAmount + maxAmount) / 2),
    loanTerm: Math.min(10, maxDuration),
  })

  const [emiDetails, setEmiDetails] = useState({
    monthlyEmi: 0,
    totalInterest: 0,
    totalAmount: 0,
  })

  // Validate input before calculation
  const isValidInput =
    Number.isFinite(formData.loanAmount) &&
    Number.isFinite(formData.loanTerm) &&
    formData.loanAmount >= minAmount &&
    formData.loanAmount <= maxAmount &&
    formData.loanTerm > 0

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value === "" ? "" : Number(value),
    })
  }

  useEffect(() => {
    if (isValidInput) {
      calculateEmi()
    } else {
      setEmiDetails({
        monthlyEmi: 0,
        totalInterest: 0,
        totalAmount: 0,
      })
    }
    // eslint-disable-next-line
  }, [formData])

  const calculateEmi = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/loans/calculate-emi", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          loanAmount: formData.loanAmount,
          interestRate: loanInterestRate,
          repaymentYears: formData.loanTerm,
        }),
      })

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`)
      }

      const data = await response.json()

      setEmiDetails({
        monthlyEmi: data.monthlyEMI || data.monthlyEmi,
        totalInterest: data.totalInterest,
        totalAmount: data.totalPayment || data.totalAmount,
      })
    } catch (error) {
      console.error("Error calculating EMI:", error)

      // Fallback to local calculation in case the API fails
      const P = formData.loanAmount
      const R = loanInterestRate / 12 / 100 // Monthly interest rate
      const N = formData.loanTerm * 12 // Loan term in months

      let emi
      if (R === 0) {
        emi = P / N
      } else {
        emi = (P * R * Math.pow(1 + R, N)) / (Math.pow(1 + R, N) - 1)
      }
      const totalAmount = emi * N
      const totalInterest = totalAmount - P

      setEmiDetails({
        monthlyEmi: emi,
        totalInterest: totalInterest,
        totalAmount: totalAmount,
      })
    }
  }

  const handleDownloadPdf = async () => {
    if (!loanId || !isValidInput) {
      alert("Cannot generate PDF: Invalid input or missing loan ID.")
      return
    }
    try {
      const response = await fetch(`http://localhost:5000/api/loans/${loanId}/emi-report-pdf`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          loanAmount: formData.loanAmount,
          interestRate: loanInterestRate,
          repaymentYears: formData.loanTerm,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate PDF")
      }

      // Download PDF
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "emi_report.pdf"
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      alert("Failed to download PDF: " + error.message)
    }
  }

  return (
    <div className="emi-calculator">
      <div className="calculator-form">
        <div className="form-group">
          <label htmlFor="loanAmount">Loan Amount (₹)</label>
          <input
            type="number"
            id="loanAmount"
            name="loanAmount"
            min={minAmount}
            max={maxAmount}
            step="1000"
            value={formData.loanAmount || ""}
            onChange={handleChange}
          />
          <small>
            Min: ₹{minAmount.toLocaleString()} &nbsp; Max: ₹{maxAmount.toLocaleString()}
          </small>
        </div>

        <div className="form-group">
          <label htmlFor="interestRate">Interest Rate (%)</label>
          <input
            type="number"
            id="interestRate"
            name="interestRate"
            value={loanInterestRate}
            readOnly
            disabled
          />
        </div>

        <div className="form-group">
          <label htmlFor="loanTerm">Loan Term (Years)</label>
          <input
            type="number"
            id="loanTerm"
            name="loanTerm"
            min="1"
            max={maxDuration}
            step="1"
            value={formData.loanTerm || ""}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="emi-results">
        <div className="result-card">
          <h3>Monthly EMI</h3>
          <div className="result-value">₹{Math.round(emiDetails.monthlyEmi).toLocaleString()}</div>
        </div>
        <div className="result-card">
          <h3>Total Interest</h3>
          <div className="result-value">₹{Math.round(emiDetails.totalInterest).toLocaleString()}</div>
        </div>
        <div className="result-card">
          <h3>Total Amount</h3>
          <div className="result-value">₹{Math.round(emiDetails.totalAmount).toLocaleString()}</div>
        </div>
      </div>

      <button className="btn btn-primary" onClick={handleDownloadPdf}>
        Download PDF Report
      </button>

      <div className="emi-note">
        <p>
          <strong>Note:</strong> This is an approximate calculation. Actual EMI may vary based on the bank's terms and
          conditions.
        </p>
      </div>
    </div>
  )
}

export default EmiCalculator