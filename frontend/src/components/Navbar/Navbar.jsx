import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, MenuItem } from 'react-pro-sidebar';
import { 
  ArrowLeft, 
  ChartLine, 
  CreditCard,
  Home, 
  Landmark,
  Menu as MenuIcon, 
  Settings2, 
  X 
} from 'lucide-react';
import SplitButton from '../Buttons/SplitButton';
import './Navbar.css';

export default function SideNavBar() {
  const [collapsed, setCollapsed] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  return (
    <div className="navbar-container">
      <div className={`navbar-wrapper ${collapsed ? 'collapsed' : ''}`}>
          <Menu className="navbar-main-menu">
            <MenuItem
              onClick={() => setCollapsed(!collapsed)}
              icon={<MenuIcon size={20} />}
            >
              <span>My Finance</span>
            </MenuItem>

            <MenuItem icon={<Home size={20} />} component={<Link to="/" />}>Overview</MenuItem>
            <MenuItem icon={<Landmark size={20} />} component={<Link to="/stock" />}>Kutxa</MenuItem>
            <MenuItem icon={<ChartLine size={20} />} component={<Link to="/stock" />}>Degiro</MenuItem>
            <MenuItem icon={<CreditCard size={20} />} component={<Link to="/stock" />}>Revolut</MenuItem>
          </Menu>
        
        <Menu className="navbar-bottom-menu">
          <MenuItem 
            icon={<Settings2 size={20} />}
            onClick={() => setShowSettings(!showSettings)}
          >
            Settings
          </MenuItem>
        </Menu>
      </div>
      <button 
        className={`navbar-toggle-button ${collapsed ? 'collapsed' : ''}`}
        onClick={() => setCollapsed(!collapsed)}
        aria-label="Toggle sidebar"
      >
        <ArrowLeft size={20} />
      </button>
      
      {showSettings && (
        <div className="settings-popup">
          <div className="settings-popup-header">
            <h3>Settings</h3>
            <button 
              className="settings-close-btn"
              onClick={() => setShowSettings(false)}
              aria-label="Close settings"
            >
              <X size={18} />
            </button>
          </div>
          <div className="settings-popup-content">
            <p>Emergency budget</p>
            <SplitButton />
          </div>
          <div className="settings-popup-content">
            <p>Peace of mind budget</p>
            <SplitButton />
          </div>
        </div>
      )}
    </div>
  );
}