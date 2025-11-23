import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'
import StockDashboard from './pages/StockDashboard'
import Navbar from './components/Navbar/Navbar'
import './App.css'

function App() {
  return (
    <Router>
      <Navbar />
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/stock-dashboard" element={<StockDashboard />} />
        </Routes>
      </div>
    </Router >
  )
}

export default App
