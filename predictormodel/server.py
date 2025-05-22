import pickle
from flask import Flask, request, jsonify
from flask_cors import CORS  # <-- Import CORS

# Load the model
with open("newmodel.pkl", "rb") as f:
    model = pickle.load(f)

app = Flask(__name__)
CORS(app)  # <-- Enable CORS for the whole app

# Define expected raw input keys
expected_input_keys = [
    'Age', 'gender', 'Academic Score (%)',
    'Institute Tier', 'Course Duration', 'Family Income',
    'Loan Amount Requested', 'co-applicant', 'Credit Score'
]

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()

    # Check for missing fields
    if not all(key in data for key in expected_input_keys):
        return jsonify({"error": "Missing features"}), 400

    try:
        # Convert gender
        gender_input = data['gender'].strip().lower()
        if gender_input == 'male':
            gendernumber = 1
        elif gender_input == 'female':
            gendernumber = 0
        else:
            return jsonify({"error": "Invalid gender value"}), 400

        # Convert co-applicant
        coapp_input = data['co-applicant'].strip().lower()
        if coapp_input == 'yes':
            coapp_number = 1
        elif coapp_input == 'no':
            coapp_number = 0
        else:
            return jsonify({"error": "Invalid co-applicant value"}), 400

        # Convert Institute Tier
        tier_input = data['Institute Tier'].strip().lower()
        if tier_input == 'tier 1':
            institute_tier = 1
        elif tier_input == 'tier 2':
            institute_tier = 2
        elif tier_input == 'tier 3':
            institute_tier = 3
        else:
            return jsonify({"error": "Invalid Institute Tier value"}), 400

        # Create input for model
        model_input = [[
            data['Age'],
            gendernumber,
            data['Academic Score (%)'],
            institute_tier,
            data['Course Duration'],
            data['Family Income'],
            data['Loan Amount Requested'],
            coapp_number,
            data['Credit Score']
        ]]

        # Predict
        prediction = model.predict(model_input)[0]
        if prediction == 0:
            return jsonify({'Loan_Status': "Not Approved"})
        else:
            return jsonify({'Loan_Status': "Approved"})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True,port=5001)
