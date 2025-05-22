"use client"

import { useState } from "react"
import "./LoanApprovalPredictor.css"

const LoanApprovalPredictor = () => {
  const [formData, setFormData] = useState({
    age: "",
    gender: "Male", // "Male" or "Female"
    academicScore: "",
    instituteTier: "Tier 1", // "Tier 1", "Tier 2", "Tier 3"
    courseDuration: "",
    familyIncome: "",
    loanAmountRequested: "",
    coApplicant: "No", // "Yes" or "No"
    creditScore: ""
  })

  const [prediction, setPrediction] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const validateForm = () => {
    return (
      formData.age &&
      formData.academicScore &&
      formData.courseDuration &&
      formData.familyIncome &&
      formData.loanAmountRequested &&
      formData.creditScore
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setPrediction(null)

    if (!validateForm()) {
      alert("Please fill all fields with valid values")
      return
    }

    setLoading(true)

    // Prepare payload as expected by your Flask backend
    const payload = {
      "Age": Number(formData.age),
      "gender": formData.gender,
      "Academic Score (%)": Number(formData.academicScore),
      "Institute Tier": formData.instituteTier,
      "Course Duration": Number(formData.courseDuration),
      "Family Income": Number(formData.familyIncome),
      "Loan Amount Requested": Number(formData.loanAmountRequested),
      "co-applicant": formData.coApplicant,
      "Credit Score": Number(formData.creditScore)
    }

    try {
      const response = await fetch(
        "http://localhost:5001/predict",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        }
      )
      const result = await response.json()
      setPrediction(result.Loan_Status || result.error || "Unknown")
    } catch (error) {
      setPrediction("Error contacting prediction service.")
    }
    setLoading(false)
  }

  return (
    <div className="loan-approval-predictor">
      <div className="predictor-intro">
        <p>
          Fill in the details below to check your chances of loan approval using our ML model.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="predictor-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="age">Age</label>
            <input
              type="number"
              id="age"
              name="age"
              className="form-control"
              value={formData.age}
              onChange={handleChange}
              placeholder="Enter your age"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="gender">Gender</label>
            <select
              id="gender"
              name="gender"
              className="form-control"
              value={formData.gender}
              onChange={handleChange}
              required
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="academicScore">Academic Score (%)</label>
            <input
              type="number"
              id="academicScore"
              name="academicScore"
              className="form-control"
              value={formData.academicScore}
              onChange={handleChange}
              placeholder="Enter academic score"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="instituteTier">Institute Tier</label>
            <select
              id="instituteTier"
              name="instituteTier"
              className="form-control"
              value={formData.instituteTier}
              onChange={handleChange}
              required
            >
              <option value="Tier 1">Tier 1</option>
              <option value="Tier 2">Tier 2</option>
              <option value="Tier 3">Tier 3</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="courseDuration">Course Duration (years)</label>
            <input
              type="number"
              id="courseDuration"
              name="courseDuration"
              className="form-control"
              value={formData.courseDuration}
              onChange={handleChange}
              placeholder="Enter course duration"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="familyIncome">Family Income (₹)</label>
            <input
              type="number"
              id="familyIncome"
              name="familyIncome"
              className="form-control"
              value={formData.familyIncome}
              onChange={handleChange}
              placeholder="Enter family income"
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="loanAmountRequested">Loan Amount Requested (₹)</label>
            <input
              type="number"
              id="loanAmountRequested"
              name="loanAmountRequested"
              className="form-control"
              value={formData.loanAmountRequested}
              onChange={handleChange}
              placeholder="Enter loan amount"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="coApplicant">Co-applicant Present</label>
            <select
              id="coApplicant"
              name="coApplicant"
              className="form-control"
              value={formData.coApplicant}
              onChange={handleChange}
              required
            >
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="creditScore">Credit Score</label>
            <input
              type="number"
              id="creditScore"
              name="creditScore"
              className="form-control"
              value={formData.creditScore}
              onChange={handleChange}
              placeholder="Enter credit score"
              required
            />
          </div>
        </div>

        <button type="submit" className="btn btn-primary predict-btn" disabled={loading}>
          {loading ? "Predicting..." : "Predict Loan Status"}
        </button>
      </form>

      {prediction && (
        <div className="prediction-result">
          <h3>Loan Status: {prediction}</h3>
        </div>
      )}
    </div>
  )
}

export default LoanApprovalPredictor