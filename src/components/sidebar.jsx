import React from 'react';
import {NavLink} from 'react-router-dom';
import './sidebar.css';
import { 
  LuUsers,          // Employees
  LuBuilding2,      // Customers
  LuFileText,       // Contracts
  LuClock,  // Shifts
  LuClipboardCheck, // Attendance
  LuTriangleAlert,  // Incidents
} from "react-icons/lu";

const Sidebar = ({isOpen}) => {
  return (
    <aside className={`sidebar ${isOpen ? '' : 'collapsed'}`}>
      <div className="sidebar-brand">
        <h2>OpsManager</h2>
      </div>

      <nav className="sidebar-menu">
        <NavLink to="/employees" className={({isActive}) => isActive ? "menu-item active" : "menu-item"}>
          <span className="icon"><LuUsers/></span> Employees 
        </NavLink>
        <NavLink to="/customers" className={({isActive}) => isActive? "menu-item active" : "menu-item"}>
          <span className="icon"><LuBuilding2/></span>
          Customers
        </NavLink>
        <NavLink to="/contracts" className={({isActive}) => isActive ? "menu-item active" : "menu-item"}>
          <span className="icon"><LuFileText/></span>
          Contracts
        </NavLink>
        <NavLink to="/shifts" className={({isActive}) => isActive ? "menu-item active" : "menu-item"}>
          <span className="icon"><LuClock/></span>
          Shifts
        </NavLink>
        <NavLink to="/attendance" className={({isActive}) => isActive ? "menu-item active" : "menu-item"}>
        <span className="icon"><LuClipboardCheck/></span>
          Attendance
        </NavLink>
        <NavLink to="/incidents" className={({isActive}) => isActive ? "menu-item active" : "menu-item"}>
        <span className="icon"><LuTriangleAlert/></span>
          Incidents
        </NavLink>
      </nav>
      <div className="sidebar-footer">
        <p>v1.0.0</p>
      </div>
    </aside>
  )
}

export default Sidebar;
