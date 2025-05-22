const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // ✅ Add this
const loanRoutes = require('./routes/loanRoutes');
require('dotenv').config();

const app = express();

app.use(cors()); // ✅ Allow cross-origin requests
app.use(express.json());

const mongouri = process.env.MONGO_URI;
mongoose.connect(mongouri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

app.use('/api/loans', loanRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});