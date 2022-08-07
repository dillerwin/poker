import { useEffect } from "react";
import { useRef, useState } from "react";
import { getDeck, shuffle, draw } from "./Cards";

export default function Cardtable({ advDealer }) {
    const [winStatus, setWinStatus] = useState();
    const [wager, setWager] = useState(0);
    const [allIn, setAllIn] = useState(false);
    const [callOrBet, setCallOrBet] = useState("Call");
    const [playerHand, setPlayerHand] = useState([]);
    const [dealerHand, setDealerHand] = useState([]);

    let dealerBank = useRef(1000);
    let playerBank = useRef(1000);

    //TODO:
    // move deck up to Game.jsx
    // see how giving Game useEffect an empty array affects displays
    // try to get deck down to (ideally) one call. Will probably be 2 because of how React is
    const deck = useRef(getDeck());

    useEffect(() => {
        console.log("deck before shuffle");
        shuffle(deck.current);
    }, []);

    function addBet(bet) {
        console.log("addBet firing");
        let tempBank = 0;
        setCallOrBet("Bet");
        switch (bet) {
            case "all": {
                setWager(wager + playerBank.current);
                playerBank.current = 0;
                setAllIn(true);
                return;
            }
            case "hundred": {
                if (playerBank.current - 100 <= playerBank.current) {
                    setWager(wager + 100);
                    playerBank.current -= 100;
                } else {
                    setWager(wager + playerBank.current);
                    playerBank.current = 0;
                    setAllIn(true);
                }
                return;
            }
            case "fifty": {
                if (playerBank.current - 50 <= playerBank.current) {
                    setWager(wager + 50);
                    playerBank.current -= 50;
                } else {
                    setWager(wager + playerBank.current);
                    playerBank.current = 0;
                    setAllIn(true);
                }
                return;
            }
            case "twenty-five": {
                if (playerBank.current - 25 <= playerBank.current) {
                    setWager(wager + 25);
                    playerBank.current -= 25;
                } else {
                    setWager(wager + playerBank.current);
                    playerBank.current = 0;
                    setAllIn(true);
                }
                return;
            }
            default: {
                return console.log("Danger Will Robinson");
            }
        }
    }

    return (
        <div className="cardtable-container">
            <div className="dealer-card-container">
                <div className="dealer-bank">
                    Dealer Bank: ${dealerBank.current}
                </div>
                <div className="opponent-cards">Opponent Cards here</div>
            </div>

            <div className="bet-container">{wager}</div>

            <div className="player-container">
                <div className="calls-container">
                    <div className="player-cards">Player Cards here</div>
                    <button className="call-bet">{callOrBet}</button>
                    <button className="fold">Fold</button>
                </div>
                <div className="chip-container">
                    <button
                        className="all-in"
                        disabled={allIn}
                        onClick={() => addBet("all")}
                    >
                        All In
                    </button>
                    <button
                        className="hundred-dollar"
                        disabled={allIn}
                        onClick={() => addBet("hundred")}
                    >
                        $100
                    </button>
                    <button
                        className="fifty-dollar"
                        disabled={allIn}
                        onClick={() => addBet("fifty")}
                    >
                        $50
                    </button>
                    <button
                        className="twenty-five-dollar"
                        disabled={allIn}
                        onClick={() => addBet("twenty-five")}
                    >
                        $25
                    </button>
                </div>
                <div className="score-container">
                    Bank: ${playerBank.current}
                </div>
            </div>
        </div>
    );
}
