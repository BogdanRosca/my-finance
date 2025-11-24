import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'
import StockDashboard from './pages/StockDashboard'
import SideNavBar from './components/Navbar/Navbar'
import './App.css'

function App() {
  return (
    <Router>
      <div style={{ display: 'flex', width: '100vw', height: '100vh', overflow: 'hidden' }}>
        <SideNavBar />
        <div className="main-content" style={{ flex: 1, overflowY: 'auto' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/stock-dashboard" element={<StockDashboard />} />
          </Routes>
        </div>
      </div>
    </Router >
  )
}

export default App
