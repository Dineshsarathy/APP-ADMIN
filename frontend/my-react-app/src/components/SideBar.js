import React from "react";
import {NavLink, useLocation } from "react-router-dom";
import { Icon } from "@iconify/react";

export default function SideBar({ isCollapsed }){
    const location = useLocation();
    return <>
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
        <div className="logo">
            <div className="logo-img">
                <img className="img" src="https://as1.ftcdn.net/v2/jpg/08/22/28/66/1000_F_822286634_JqfHuMV7aEWpjIP3x23GPwzz2Blcd5Wg.jpg" />
                {!isCollapsed && <span>APP ADMIN</span>}
            </div>
        </div>
        <div className="content">
            <ul className="menu">
                <li className="menu-item">
                    <NavLink className={({ isActive }) => (isActive ? 'active-link' : 'Link')} to={'/super-admin'}>
                <span><Icon icon="fa:home" style={{ fontSize: '16px',color:'white',padding:"0px 10px" }}  /></span>
                {!isCollapsed && <span>Home</span>} 
                    </NavLink>
                </li>
                <li className="menu-item">
              <NavLink 
                className={({ isActive }) => (isActive ? 'active-link' : 'Link')} 
                to="/template-list"
              >
                <Icon icon="material-symbols-light:window" style={{ fontSize: '22px',color:'white',padding:"0px 10px" }}  />
                {!isCollapsed && <span>Template List</span>} {/* Link to Template List */}
              </NavLink>
            </li>                
                <li className="menu-item">
                    <NavLink className={({ isActive }) => (isActive ? 'active-link' : 'Link')} to={'/task-report'}>
                <Icon className="i" icon="material-symbols:report-outline" style={{ fontSize: '22px',color:'white',padding:"0px 10px",textAlign: "center" }}  />
                {!isCollapsed && <span>Testing Report</span>}
                    </NavLink>
                </li>
                <li className="menu-item">
                    <NavLink className={({ isActive }) => (isActive ? 'active-link' : 'Link')} to={'/bug-report'}>
                <Icon icon="material-symbols:bug-report" style={{ fontSize: '22px',color:'white',padding:"0px 10px" }}  />
                {!isCollapsed && <span>Assigned Bug</span>}
                    </NavLink>
                </li>
            </ul>
        </div>
    </div>
    
   
   
    
    </>
}
