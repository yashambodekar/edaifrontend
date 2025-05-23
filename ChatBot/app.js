const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');
const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());

// Configuration
const CONFIG = {
  GROQ_API_KEY: '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' // Replace with your actual key
};

// Available Groq models
const GROQ_MODELS = {
  MIXTRAL: 'mixtral-8x7b-32768',
  LLAMA3_SMALL: 'llama3-8b-8192',
  LLAMA3_LARGE: 'llama3-70b-8192',
  GEMMA: 'gemma-7b-it'
};

// Model selection logic
const getBestModel = () => GROQ_MODELS.LLAMA3_SMALL;

// Enhanced logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

app.get('/models', (req, res) => {
  res.json({
    available_models: GROQ_MODELS,
    recommended_model: getBestModel()
  });
});

app.post('/chat', async (req, res) => {
  const userMessage = req.body.message;
  
  if (!userMessage) {
    return res.status(400).json({ 
      error: 'Message is required',
      example: { message: "What documents are needed for an education loan?" }
    });
  }

  const selectedModel = getBestModel();
  console.log(`Using model: ${selectedModel}`);
  
  // Helper function to remove HTML tags
  function stripHtmlTags(str) {
    return str.replace(/<\/?[^>]+(>|$)/g, "");
  }

  try {
    const groqResponse = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: selectedModel,
        messages: [
          {
            role: "system",
            content: `You are an expert education loan advisor. Provide accurate information about:
                     - Loan eligibility criteria
                     - Interest rates and calculations
                     - Required documents
                     - Repayment options
                     - Loan forgiveness programs
                     - Country-specific loan programs
                     
                     Keep responses concise (under 200 words) and factual. 
                     If asked about non-education topics, politely decline.`
          },
          {
            role: "user",
            content: userMessage
          }
        ],
        temperature: 0.3,
        max_tokens: 1024
      },
      {
        headers: {
          'Authorization': `Bearer ${CONFIG.GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000
      }
    );

    const botReply = groqResponse.data.choices[0]?.message?.content;

    if (!botReply) {
      throw new Error('Empty response from Groq API');
    }

    // Clean reply by stripping HTML tags and trimming whitespace
    const cleanReply = stripHtmlTags(botReply).trim();

    res.json({ reply: cleanReply });

  } catch (error) {
    console.error('API Error:', error);
    
    if (error.response?.data?.error?.code === 'model_decommissioned') {
      return res.status(400).json({
        error: 'The requested model is no longer available',
        solution: 'Please use the /models endpoint to see current options',
        available_models: Object.values(GROQ_MODELS),
        recommended_model: getBestModel()
      });
    }

    res.status(500).json({
      error: 'Education loan query failed',
      details: error.response?.data?.error?.message || error.message,
      support_contact: 'loansupport@university.edu',
      emergency_contact: '+1-800-EDU-LOAN'
    });
  }
});


app.listen(PORT, () => {
  console.log(`Education Loan Chatbot API running on http://localhost:${PORT}`);
  console.log('Available models:', Object.values(GROQ_MODELS));
  console.log('Current recommended model:', getBestModel());
  console.log('\nTest endpoints:');
  console.log(`GET  http://localhost:${PORT}/models`);
  console.log(`POST http://localhost:${PORT}/chat`);
  console.log('Example POST body: {"message":"What is the interest rate for federal student loans?"}');
});