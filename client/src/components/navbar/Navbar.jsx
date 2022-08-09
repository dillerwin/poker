import React from "react";
import { useNavigate } from "react-router";
import "./navbar.css";

export default function Navbar(props) {
    const navigate = useNavigate();
    return (
        <span className="navbar">
            <div className="navbar-container">
                <button className="navbar-home" onClick={() => navigate("/")}>Home</button>
                <div>Hello There, I'm a Navigation Bar</div>
            </div>
        </span>
    );
}
