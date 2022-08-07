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
    const [refresh, setRefresh] = useState(0);

    let refreshDealerArray = useRef(true);
    let dealerList = useRef([]);
    let currentDealer = useRef("");
    let dealerOutfits = useRef("");
    let outfitId = useRef("");
    let dealerName = useRef("");

    useEffect(() => {
        fetch("/api/dealerList")
            .then((res) => res.json())
            .then((dealers) => {
                console.log("dealerList firing");
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
                    <Route
                        path="/dealers"
                        element={<Dealers dealerList={dealerList} />}
                    />
                    <Route
                        path="/dealer/:dealerName"
                        element={
                            <Dealer
                                refreshDealerArray={refreshDealerArray}
                                dealerList={dealerList}
                                dealerName={dealerName}
                                outfitId={outfitId}
                            />
                        }
                    />
                    <Route
                        path="/play"
                        element={
                            <Game
                                refreshDealerArray={refreshDealerArray}
                                dealerList={dealerList}
                                dealerName={dealerName}
                                outfitId={outfitId}
                                refresh={refresh}
                                setRefresh={() => setRefresh}
                            />
                        }
                    />
                    <Route
                        path="/end"
                        element={
                            <div className="end">
                                That's all the models. Go do something else.
                            </div>
                        }
                    />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
