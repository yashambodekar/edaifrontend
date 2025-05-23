"use client"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import "./HomePage.css"

const HomePage = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    amount: "",
    maxInterest: "",
    collateral: "",
  })
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.amount || isNaN(formData.amount) || formData.amount <= 0) {
      newErrors.amount = "Please enter a valid loan amount"
    }

    if (!formData.maxInterest || isNaN(formData.maxInterest) || formData.maxInterest <= 0) {
      newErrors.maxInterest = "Please enter a valid maximum interest rate"
    }

    if (!formData.collateral) {
      newErrors.collateral = "Please select whether collateral is available"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
  e.preventDefault();

  if (validateForm()) {
    // If collateral is "Yes", send empty string to show both types
    const collateralParam = formData.collateral === "Yes" ? "" : formData.collateral;
    navigate(
      `/loans?amount=${formData.amount}&maxInterest=${formData.maxInterest}&collateral=${collateralParam}`
    );
  }
}

  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Find the Perfect Education Loan for Your Future</h1>
          <p className="hero-subtitle">
            Compare education loans from various banks and financial institutions to find the best option for your
            academic journey.
          </p>
        </div>
      </section>

      <section className="loan-search-section">
        <div className="card loan-search-card">
          <h2 className="section-title">Enter Your Loan Requirements</h2>
          <form onSubmit={handleSubmit} className="loan-search-form">
            <div className="form-group">
              <label htmlFor="amount">Loan Amount (₹)</label>
              <input
                type="number"
                id="amount"
                name="amount"
                className="form-control"
                value={formData.amount}
                onChange={handleChange}
                placeholder="Enter loan amount"
              />
              {errors.amount && <p className="error-message">{errors.amount}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="maxInterest">Maximum Interest Rate (%)</label>
              <input
                type="number"
                id="maxInterest"
                name="maxInterest"
                className="form-control"
                value={formData.maxInterest}
                onChange={handleChange}
                placeholder="Enter maximum interest rate"
                step="0.01"
              />
              {errors.maxInterest && <p className="error-message">{errors.maxInterest}</p>}
            </div>

            <div className="form-group">
              <label>Collateral Available</label>
              <div className="radio-group">
                <div className="radio-option">
                  <input
                    type="radio"
                    id="collateralYes"
                    name="collateral"
                    value="Yes"
                    checked={formData.collateral === "Yes"}
                    onChange={handleChange}
                  />
                  <label htmlFor="collateralYes">Yes</label>
                </div>
                <div className="radio-option">
                  <input
                    type="radio"
                    id="collateralNo"
                    name="collateral"
                    value="No"
                    checked={formData.collateral === "No"}
                    onChange={handleChange}
                  />
                  <label htmlFor="collateralNo">No</label>
                </div>
              </div>
              {errors.collateral && <p className="error-message">{errors.collateral}</p>}
            </div>

            <button type="submit" className="btn btn-primary search-btn">
              Find Eligible Loans
            </button>
          </form>
        </div>
      </section>

      <section className="features-section">
        <h2 className="section-title">Why Choose Eduloan?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <i className="fas fa-search"></i>
            </div>
            <h3 className="feature-title">Compare Multiple Loans</h3>
            <p className="feature-description">
              Compare education loans from various banks and financial institutions side by side.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <i className="fas fa-calculator"></i>
            </div>
            <h3 className="feature-title">EMI Calculator</h3>
            <p className="feature-description">Calculate your monthly EMI, total interest, and total amount payable.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <i className="fas fa-check-circle"></i>
            </div>
            <h3 className="feature-title">Loan Approval Prediction</h3>
            <p className="feature-description">Get an estimate of your loan approval chances before applying.</p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage
