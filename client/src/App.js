/** @format */

import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { useEffect, useRef, useState } from "react";

import Home from "./components/homepage/Home.jsx";
import Navbar from "./components/navbar/Navbar";
import Dealers from "./components/dealerpage/Dealers.jsx";
import Dealer from "./components/dealerpage/Dealer";
import Game from "./components/game/Game";

function App() {
    let refreshDealerArray = useRef(true);
    let dealerList = useRef([]);
    let currentDealer = useRef("");
    let dealerOutfit = useRef("");

    useEffect(() => {
        fetch("/api/dealerList")
            .then((res) => res.json())
            .then((dealers) => {
                dealerList.current = dealers;
            });
    }, []);

    return (
        <div className="App">
            {/* BrowserRouter used for client-side routing */}
            <BrowserRouter>
                <Navbar />
                <Routes>
                    {/* TODO: add a login of some kind, maybe with a sneaky terms and conditions page agreement? */}
                    <Route path="/" element={<Home />} />
                    <Route path="/dealers" element={<Dealers />} />
                    <Route
                        path="/dealer/:dealerName"
                        element={
                            <Dealer refreshDealerArray={refreshDealerArray} />
                        }
                    />
                    <Route
                        path="/play/:outfitId"
                        element={
                            <Game refreshDealerArray={refreshDealerArray} />
                        }
                    />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
