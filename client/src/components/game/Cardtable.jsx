import { useEffect } from "react";
import { useRef, useState } from "react";
import { getDeck, shuffle, draw } from "./Cards";

export default function Cardtable({ advDealer }) {
    const [winStatus, setWinStatus] = useState();
    const [pot, setPot] = useState(0);
    const [dealerWager, setDealerWager] = useState(0);
    const [playerWager, setPlayerWager] = useState(0);
    const [allIn, setAllIn] = useState(false);
    const [callOrBet, setCallOrBet] = useState("Call");
    const [playerCards, setPlayerCards] = useState([]);
    const [dealerCards, setDealerCards] = useState([]);

    let dealerBank = useRef(1000);
    let dealerRoundBank = useRef(dealerBank.current);
    let playerBank = useRef(1000);
    let playerRoundBank = useRef(playerBank.current);
    let turn = useRef(0);
    let playerHand = useRef([]);
    let dealerHand = useRef([]);

    const deck = useRef({});

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
                            className="card-container"
                            key={`${card.Suit}-${card.Value}`}
                        >
                            <img
                                className="playing-card"
                                alt={`${card.Value} of ${card.Suit}`}
                                src={`./cardResource/${cardName}.svg`}
                            ></img>
                        </div>
                    );
                })
            );
            setDealerCards(
                dealerHand.current.map((card) => {
                    let cardName = "";
                    if (!card.Show) {
                        cardName = "BACK";
                    } else {
                        cardName = `${card.Suit}-${card.Value}`;
                    }
                    return (
                        <div
                            className="card-container"
                            key={`${card.Suit}-${card.Value}`}
                        >
                            <img
                                className="playing-card"
                                alt={`dealer card`}
                                src={`./cardResource/${cardName}.svg`}
                            ></img>
                        </div>
                    );
                })
            );
        }
        if (turn.current === 1) {
            console.log("turn 1");
        }
    }, []);

    function addWager(bet) {
        setCallOrBet("Bet");
        switch (bet) {
            case "all": {
                setPlayerWager(playerWager + playerRoundBank.current);
                playerRoundBank.current = 0;
                setAllIn(true);
                return;
            }
            case "hundred": {
                if (playerRoundBank.current - 100 > 0) {
                    setPlayerWager(playerWager + 100);
                    playerRoundBank.current -= 100;
                } else {
                    setPlayerWager(playerWager + playerRoundBank.current);
                    playerRoundBank.current = 0;
                    setAllIn(true);
                }
                return;
            }
            case "fifty": {
                if (playerRoundBank.current - 50 > 0) {
                    setPlayerWager(playerWager + 50);
                    playerRoundBank.current -= 50;
                } else {
                    setPlayerWager(playerWager + playerRoundBank.current);
                    playerRoundBank.current = 0;
                    setAllIn(true);
                }
                return;
            }
            case "twenty-five": {
                if (playerRoundBank.current - 25 > 0) {
                    setPlayerWager(playerWager + 25);
                    playerRoundBank.current -= 25;
                } else {
                    setPlayerWager(playerWager + playerRoundBank.current);
                    playerRoundBank.current = 0;
                    setAllIn(true);
                }
                return;
            }
            default: {
                return console.log("Danger Will Robinson");
            }
        }
    }

    //TODO: add function to advance gameplay
    // GOAL:
    //- this function should end the player's turn, disable the chip's onClick and disable (or hide?) the Bet/Call and Fold buttons
    //- then have the dealer decide if they're calling or betting if they're betting, should pass back to the player. If not,
    //- run the hand comparison and see who wins. If the player wins, call advDealer(). If not, start the next round

    function endTurn(fold) {
        if (fold) {
            // end round
            return null;
        }
    }

    function handleClick(action) {
        switch (action) {
            case "Call": {
                console.log("Call case fired");
                endTurn();
                return;
            }
            case "Bet": {
                console.log("Bet case fired");
                setPot(pot + playerWager);
                setPlayerWager(0);
                playerBank.current = playerRoundBank.current;
                endTurn();
                return;
            }
            case "Fold": {
                console.log("Fold case fired");
                if (!!playerWager) {
                    playerRoundBank.current += playerWager;
                }
                playerBank.current = playerRoundBank.current;
                dealerBank.current += pot;
                dealerRoundBank.current = dealerBank.current;
                setPot(0);
                setPlayerWager(0);
                endTurn(true);
                setAllIn(false);
                return;
            }
            case "Clear": {
                console.log("Clear case fired");
                playerRoundBank.current = playerBank.current;
                setPlayerWager(0);
                setAllIn(false);
                setCallOrBet("Call");
                return;
            }
            default: {
                return console.log("We're having issues");
            }
        }
    }

    return (
        <div className="cardtable-container">
            {/* DEALER PLAY AREA */}
            <div className="dealer-container">
                <div className="dealer-bank">
                    Dealer Bank: ${dealerRoundBank.current}
                </div>
                <div className="playing-cards-container">{dealerCards}</div>
            </div>

            <div className="bet-container">
                {/* DEALER WAGER */}
                <div className="dealer-wager">
                    Dealer's Wager: {dealerWager}
                </div>
                {/* BET POOL */}
                <div className="pot-container">Pot: {pot}</div>
                {/* PLAYER WAGER */}
                <div className="player-wager-container">
                    Current Wager: {playerWager}
                </div>
            </div>

            {/* PLAYER PLAY AREA */}
            <div className="player-container">
                <div className="playing-cards-container">{playerCards}</div>
                <div className="calls-container">
                    {/* CALL/BET BUTTON */}
                    {/* GOAL: the button will change from CALL to BET when the player's bet is greater than the dealer's */}
                    <button
                        className="call-bet"
                        onClick={() => handleClick(callOrBet)}
                    >
                        {callOrBet}
                    </button>
                    {/* BET BUTTON */}
                    <button
                        className="fold"
                        onClick={() => handleClick("Fold")}
                    >
                        Fold
                    </button>
                    <button
                        className="clearWager"
                        onClick={() => handleClick("Clear")}
                    >
                        Clear
                    </button>
                </div>
                {/* POKER CHIP CONTAINER */}
                <div className="chip-container">
                    <div className="chip-holder">
                        {/* ALLOWS PLAYER TO BET THEIR ENTIRE BANK */}
                        <button
                            className="all-in"
                            id="chip"
                            disabled={allIn}
                            onClick={() => addWager("all")}
                        >
                            All In
                        </button>
                        {/* BETS $100 */}
                        <button
                            className="hundred-dollar"
                            id="chip"
                            disabled={allIn}
                            onClick={() => addWager("hundred")}
                        >
                            $100
                        </button>
                        {/* BETS $50 */}
                        <button
                            className="fifty-dollar"
                            id="chip"
                            disabled={allIn}
                            onClick={() => addWager("fifty")}
                        >
                            $50
                        </button>
                        {/* BETS $25 */}
                        <button
                            className="twenty-five-dollar"
                            id="chip"
                            disabled={allIn}
                            onClick={() => addWager("twenty-five")}
                        >
                            $25
                        </button>
                    </div>
                </div>
                {/* PLAYER'S REMAINING MONEY */}
                <div className="player-bank">
                    Bank: ${playerRoundBank.current}
                </div>
            </div>
        </div>
    );
}
