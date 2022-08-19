import React from "react";
import { useNavigate } from "react-router";
import "./navbar.css";

export default function Navbar(props) {
    const navigate = useNavigate();
    return (
        <span className="navbar">
            <div className="navbar-container">
                <button className="navbar-home" onClick={() => navigate("/")}>Home</button>
                <button className="navbar-dealers" onClick={()=>navigate("/dealers")}>Dealers</button>
                <button className="navbar-start" onClick={()=>navigate("/play")}>Random Dealer</button>
            </div>
        </span>
    );
}
