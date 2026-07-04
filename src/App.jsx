import { useState } from 'react'
import {Routes, Route, Navigate} from 'react-router-dom';
import Employees from './pages/employees';
import Customers from './pages/customers';
import Contracts from './pages/contracts';
import Shifts from './pages/shifts';
import Incidents from './pages/incidents';
import Sidebar from './components/sidebar';
import Navbar from './components/navbar';
import Login from './pages/login'
import './App.css';
import Attendance from './pages/attendance';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const isLoggedIn = !!localStorage.getItem('token');
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  };
  if(!isLoggedIn){
    return(
      <Routes>
        <Route path="/login" element={<Login/>}></Route>
        <Route path="*" element={<Navigate to="/login"/>}/>
      </Routes>
    )
  }
  return (
    <div className="app-container">
      <Sidebar isOpen={isSidebarOpen}/>
      <div className='main-wrapper'>
        <Navbar toggleSidebar={toggleSidebar}/>
        <main className='content-area'>
          <Routes>
            <Route path="/employees" element={<Employees/>}/>
            <Route path="/customers" element={<Customers/>}/>
            <Route path="/contracts" element={<Contracts/>}/>
            <Route path="/shifts" element={<Shifts/>}/>
            <Route path="/attendance" element={<Attendance/>}/>
            <Route path="/incidents" element={<Incidents/>}/>
          </Routes>
        </main>
      </div>
    </div>
  )
} 

export default App;