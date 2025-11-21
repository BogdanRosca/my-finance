import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import StockDashboard from './pages/StockDashboard'
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/stocks" element={<StockDashboard />} />
      </Routes>
    </Router>
  )
}

export default App
