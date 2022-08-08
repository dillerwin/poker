import { useEffect } from "react";
import { useRef, useState } from "react";
import { getDeck, shuffle, draw } from "./Cards";

export default function Cardtable({ advDealer }) {
    const [winStatus, setWinStatus] = useState();
    const [wager, setWager] = useState(0);
    const [allIn, setAllIn] = useState(false);
    const [callOrBet, setCallOrBet] = useState("Call");
    const [playerCards, setPlayerCards] = useState([]);
    const [dealerCards, setDealerCards] = useState([]);

    let dealerBank = useRef(1000);
    let playerBank = useRef(1000);
    let turn = useRef(0);
    let playerHand = useRef([]);
    let dealerHand = useRef([]);

    const deck = useRef({});

    //TODO:
    // move deck up to Game.jsx
    // see how giving Game useEffect an empty array affects displays
    // try to get deck down to (ideally) one call. Will probably be 2 because of how React is

    useEffect(() => {
        if (turn.current === 0) {
            console.log("shuffling new deck");
            deck.current = getDeck();

            shuffle(deck.current);
            turn.current += 1;
            playerHand.current = draw(deck.current, 5, "player");
            dealerHand.current = draw(deck.current, 5, "dealer");

            setPlayerCards(
                playerHand.current.map((card) => {
                    console.log("card", card);

                    let cardName = `${card.Suit}-${card.Value}`;

                    return (
                        <div
                            className="player-card-container"
                            key={`${card.Suit}-${card.Value}`}
                        >
                            <img
                                className={`player-card ${cardName}`}
                                alt={`${card.Value} of ${card.Suit}`}
                                src={`./cardResource/${cardName}.svg`}
                            ></img>
                        </div>
                    );
                })
            );
            setDealerCards(
                dealerHand.current.map((card) => {
                    console.log("card", card);

                    return (
                        <div
                            className="dealer-card-container"
                            key={`${card.Suit}-${card.Value}`}
                        >
                            <img
                                className="dealer-card"
                                alt={`dealer card`}
                                src={`./cardResource/BACK.svg`}
                            ></img>
                        </div>
                    );
                })
            );
        }
        if (turn.current === 1) {
            console.log("turn 1");
            console.log("playerHand", playerHand.current);
            console.log("dealerHand", dealerHand.current);
        }
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
            <div className="dealer-container">
                <div className="dealer-bank">
                    Dealer Bank: ${dealerBank.current}
                </div>
                <div className="dealer-cards-container">{dealerCards}</div>
            </div>

            <div className="bet-container">Bet: {wager}</div>

            <div className="player-container">
                <div className="player-cards">Player Cards here</div>
                <div className="calls-container">
                    <button className="call-bet">{callOrBet}</button>
                    <button className="fold">Fold</button>
                </div>
                <div className="chip-container">
                    <div className="chip-holder">
                        <button
                            className="all-in"
                            id="chip"
                            disabled={allIn}
                            onClick={() => addBet("all")}
                        >
                            All In
                        </button>
                        <button
                            className="hundred-dollar"
                            id="chip"
                            disabled={allIn}
                            onClick={() => addBet("hundred")}
                        >
                            $100
                        </button>
                        <button
                            className="fifty-dollar"
                            id="chip"
                            disabled={allIn}
                            onClick={() => addBet("fifty")}
                        >
                            $50
                        </button>
                        <button
                            className="twenty-five-dollar"
                            id="chip"
                            disabled={allIn}
                            onClick={() => addBet("twenty-five")}
                        >
                            $25
                        </button>
                    </div>
                </div>
                <div className="player-bank">Bank: ${playerBank.current}</div>
            </div>
        </div>
    );
}
