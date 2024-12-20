import React from 'react';
import "./styles/Taskreport.css";
import "./styles/Templatelist.css";
import "./styles/Dashboard.css";
import "./styles/App.css";
import "./styles/Header.css";
import "./styles/Slider.css";
import "./styles/Home.css";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SuperAdmin from './pages/SuperAdmin';
import TemplateList from './pages/Templatelist';
import TaskReportList from './pages/TaskReportList';
import AssignedBug from'./pages/AssignedBug';
import Autheticate from './pages/Emplogin';
import ProtectedRoute from './controller/ProtectedRoute';





function App() {
  return (
    <Router>
      <div className="App">
       
        
        {/* Define routes for your pages */}
        <Routes>
          <Route path="/dashboard" element={<ProtectedRoute><SuperAdmin/></ProtectedRoute>} />
          <Route path="/template-list" element={<TemplateList />} />
          <Route path="/super-admin" element={<SuperAdmin />} />
          <Route path="/task-report" element={<TaskReportList />} />
          <Route path="/bug-report" element={<AssignedBug />} />
          <Route path="/emp-login" element={<Autheticate/>}/>
          
          {/* Add other routes here */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;

