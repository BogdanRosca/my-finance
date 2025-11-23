import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'
import StockDashboard from './pages/StockDashboard'
import Navbar from './components/Navbar/Navbar'
import './App.css'

function App() {
  return (
    <Router>
      <div className='header' >
        <header className="app-header">
          <div className="header-logo">
            <img
              src="/src/assets/finance_logo.png"
              alt="My Finance Logo"
              className="header-logo-image"
            />
            <h1>My Finance</h1>
          </div>
        </header>
      </div>
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
