
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import "./App.css"
import Header from "./components/Header"
import Footer from "./components/Footer"
import ChatbotWidget from "./components/ChatbotWidget";
import HomePage from "./pages/HomePage"
import LoansPage from "./pages/LoansPage"

function App() {
  return (
    <Router>
      <div className="app">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/loans" element={<LoansPage />} />
          </Routes>
          <ChatbotWidget />
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App

