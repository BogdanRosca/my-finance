import { useState } from 'react';
import { Menu, MenuItem } from 'react-pro-sidebar';
import { Home, ArrowLeft, ChartLine, Settings2, Menu as MenuIcon } from 'lucide-react';
import './Navbar.css';

export default function SideNavBar() {
  const [collapsed, setCollapsed] = useState(false);

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

            <MenuItem icon={<Home size={20} />}>Overview</MenuItem>
            <MenuItem icon={<ChartLine size={20} />}>Stocks</MenuItem>
          </Menu>
        
        <Menu className="navbar-bottom-menu">
          <MenuItem icon={<Settings2 size={20} />}>Settings</MenuItem>
        </Menu>
      </div>
      <button 
        className={`navbar-toggle-button ${collapsed ? 'collapsed' : ''}`}
        onClick={() => setCollapsed(!collapsed)}
        aria-label="Toggle sidebar"
      >
        <ArrowLeft size={20} />
      </button>
    </div>
  );
}