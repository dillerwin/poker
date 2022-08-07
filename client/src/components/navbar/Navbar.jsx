import React from "react";
import { useNavigate } from "react-router";
import "./navbar.css";

export default function Navbar(props) {
    const navigate = useNavigate();
    return (
        <span className="navbar">
            Hello There, I'm a Navigation Bar
            <button onClick={() => navigate("/")}>Home</button>
        </span>
    );
}
