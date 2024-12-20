import React from "react";
import { Icon } from "@iconify/react";

export default function Header({ toggleSidebar }) {
    
    return <>
    
    <div className="header">
        <div className="menu-side">
            <div>
                <Icon icon="ci:menu-alt-03" style={{ fontSize: '40px',marginLeft:'-20px',color:'white' }} onClick={toggleSidebar} />
            </div>
        </div>
        <div className="profiles">
            <input className="search-main" type="search" placeholder="Search..."/>
            <span>
            <Icon className="bell" icon="gridicons:bell" style={{ fontSize: '28px', }} />
            </span>
            <span>
            <img style={{width:'30px',height:'30px', borderRadius:'50%'}} src="https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1522&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"/></span> Scarlet Jhonson
         </div>

    </div>
    
    </>
}