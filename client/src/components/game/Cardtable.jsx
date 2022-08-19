import { useEffect } from "react";
import { useRef, useState } from "react";
import { getDeck, shuffle, draw, discard, evaluateHands } from "./Cards";

export default function Cardtable({ advDealer }) {
    // const [winStatus, setWinStatus] = useState();
    const [pot, setPot] = useState(0);
    // const [dealerWager, setDealerWager] = useState(0);
    const [playerWager, setPlayerWager] = useState(0);
    const [disableBtns, setDisableBtns] = useState(false);
    const [disableChips, setDisableChips] = useState(false);
    const [callOrBet, setCallOrBet] = useState("Call");
    const [cardSelect, toggleCardSelect] = useState(false);

    //playerCards/dealerCards are the visible cards on the table
    const [playerCards, setPlayerCards] = useState([]);
    const [dealerCards, setDealerCards] = useState([]);

    let dealerBank = useRef(1000);
    let playerBank = useRef(1000);
    let dealerWager = useRef(0);
    let phase = useRef("begin");
    // "begin" - new round
    // "ante" - add money to pot
    // "bet" - dealer decides to call/bet/fold
    // "discard" - player/dealer choose cards to discard
    // "draw" - player/dealer draw to replace
    // "bet2" - dealer again decides to call/bet/fold
    // "end" - resolve winning hand or if someone folded, add pot to winner's bank

    //playerHand/dealerHand are the actual values of the hand in play
    let playerHand = useRef([]);
    let dealerHand = useRef([]);
    let drawBtnDisplay = useRef("none");

    const deck = useRef({});

    function buildPlayerHand() {
        setPlayerCards(
            playerHand.current.map((card) => {
                let cardName = `${card.Suit}-${card.Value}`;

                return (
                    <div className="card-container" key={`${cardName}`}>
                        <img
                            className="playing-card"
                            style={
                                card.Selected
                                    ? { boxShadow: "0 0 0 3px red" }
                                    : {}
                            }
                            alt={`${card.Value} of ${card.Suit}`}
                            src={`./cardResource/${cardName}.svg`}
                            onClick={() =>
                                handleCardClick([card.Suit, card.Value])
                            }
                        ></img>
                    </div>
                );
            })
        );
    }
    function buildDealerHand() {
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

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        console.warn(`current phase '${phase.current}'`);
        if (phase.current === "begin") {
            setDisableChips(true);
            setDisableBtns(true);
            deck.current = getDeck();

            shuffle(deck.current);
            playerHand.current = draw(deck.current, 5, "player");
            dealerHand.current = draw(deck.current, 5, "dealer");

            //TODO: playCards and dealerCards need an onClick for discard phase

            buildPlayerHand();
            buildDealerHand();
            phase.current = "ante";
        } else if (phase.current === "ante") {
            setTimeout(() => {
                playerBank.current -= 25;
                dealerBank.current -= 25;
                setPot(50);
                playerBank.current !== 0
                    ? setDisableChips(false)
                    : setDisableChips(true);
                setDisableBtns(false);
            }, 1000);
            phase.current = "bet";
        }
    });

    function addWager(bet) {
        setCallOrBet("Bet");
        switch (bet) {
            case "all": {
                setPlayerWager(playerWager + playerBank.current);
                playerBank.current = 0;
                setDisableChips(true);
                return;
            }
            case "hundred": {
                if (playerBank.current - 100 > 0) {
                    setPlayerWager(playerWager + 100);
                    playerBank.current -= 100;
                } else {
                    setPlayerWager(playerWager + playerBank.current);
                    playerBank.current = 0;
                    setDisableChips(true);
                }
                return;
            }
            case "fifty": {
                if (playerBank.current - 50 > 0) {
                    setPlayerWager(playerWager + 50);
                    playerBank.current -= 50;
                } else {
                    setPlayerWager(playerWager + playerBank.current);
                    playerBank.current = 0;
                    setDisableChips(true);
                }
                return;
            }
            case "twenty-five": {
                if (playerBank.current - 25 > 0) {
                    setPlayerWager(playerWager + 25);
                    playerBank.current -= 25;
                } else {
                    setPlayerWager(playerWager + playerBank.current);
                    playerBank.current = 0;
                    setDisableChips(true);
                }
                return;
            }
            default: {
                return console.error("Danger Will Robinson");
            }
        }
    }

    //TODO: add function to advance gameplay
    // GOAL:
    //- this function should end the player's turn, disable the chip's onClick and disable (or hide?) the Bet/Call and Fold buttons
    //- then have the dealer decide if they're calling or betting if they're betting, should pass back to the player. If not,
    //- run the hand comparison and see who wins. If the player wins, call advDealer(). If not, start the next round

    function endPhase(fold) {
        console.warn("at endPhase, phase:", phase.current);

        switch (phase.current) {
            case "eval": {
                let evaluate = evaluateHands(
                    dealerHand.current,
                    playerHand.current,
                    phase.current
                );

                if (evaluate) {
                    console.log("evaluate", evaluate);
                }
                return null;
            }
            case "bet": {
                setTimeout(() => {
                    //TODO: this is currently allowing dealer to go negative
                    // console.log("playerWager", playerWager);
                    if (dealerBank - playerWager < 0) {
                        let temp = playerWager - dealerBank;
                        playerBank += temp;
                        setPlayerWager(playerWager - temp);
                        dealerWager.current = dealerBank.current;
                        dealerBank.current = 0;
                    } else {
                        dealerWager.current = playerWager;
                        dealerBank.current -= playerWager;
                    }
                    phase.current = "eval";
                    drawBtnDisplay.current = "flex";
                    setPot(pot + playerWager + dealerWager.current);
                    setPlayerWager(0);
                    dealerWager.current = 0;
                    setCallOrBet("Call");
                    setDisableChips(true);
                    setDisableBtns(true);
                }, 500);

                return null;
            }
            case "discard": {
                drawBtnDisplay.current = "none";
                phase.current = "draw";
                endPhase();
                return null;
            }
            case "draw": {
                //FIXME: I'm sure this is part of the draw issues
                discard(deck.current, "player", playerHand.current);
                discard(deck.current, "dealer", dealerHand.current);
                phase.current = "bet2";
                setTimeout(() => {
                    buildPlayerHand();
                    buildDealerHand();
                    setCallOrBet("Call");
                    playerBank.current !== 0
                        ? setDisableChips(false)
                        : setDisableChips(true);
                    setDisableBtns(false);
                }, 500);

                return null;
            }
            case "bet2": {
                setTimeout(() => {
                    if (dealerBank - playerWager < 0) {
                        let temp = playerWager - dealerBank;
                        playerBank += temp;
                        setPlayerWager(playerWager - temp);
                        dealerWager.current = dealerBank.current;
                        dealerBank.current = 0;
                    } else {
                        dealerWager.current = playerWager;
                        dealerBank.current -= playerWager;
                    }
                    setPot(pot + playerWager + dealerWager.current);
                    setPlayerWager(0);
                    setCallOrBet("Call");
                    phase.current = "end";
                    setDisableBtns(true);
                    endPhase();
                }, 500);
                return null;
            }
            case "end": {
                // GOAL: this will include a catch to see if the player has any money left in playerHand.current if they lose
                //  - if not, will throw a "hard lose" with a "Start Over?" prompt which, if clicked, will start the dealerArray back at index 0,
                //  - set both banks to 1000, and restart the game
                //  - if the "scroll previous" is implemented, this will need to clear that choice as well
                console.log("ending round");
                if (fold) {
                    // end round
                    phase.current = "begin";
                    setCallOrBet("Call");
                    return null;
                }
                let evaluate = evaluateHands(
                    dealerHand.current,
                    playerHand.current,
                    phase.current
                );
                console.log("evaluate", evaluate);
                if (evaluate) {
                    playerBank.current += pot;
                    setPot(0);
                    if (dealerBank.current <= 0) {
                        dealerBank.current = 1000;
                    }
                    setDisableChips(true);
                    setDisableBtns(true);
                    setCallOrBet("Call");
                    phase.current = "begin";
                    //GOAL: advDealer() should only be called if dealer is at $0
                    //- dealers should also be able to go negative, I think.
                    //- negative score would come out of the pot next round
                    advDealer();
                }
                return null;
            }
            case "begin": {
                return;
            }
            default: {
                console.warn("You got issues in endPhase");
                return false;
            }
        }
    }

    function handleClick(action) {
        switch (action) {
            case "Draw": {
                endPhase();
                return null;
            }
            case "Call": {
                endPhase();
                return;
            }
            case "Bet": {
                setPot(pot + playerWager * 2);
                setPlayerWager(0);
                endPhase();
                return;
            }
            case "Fold": {
                if (!!playerWager) {
                    playerBank.current += playerWager;
                }
                dealerBank.current += pot;
                phase.current = "end";
                setPot(0);
                setPlayerWager(0);
                endPhase(true);
                setDisableChips(false);
                return;
            }
            case "Clear": {
                playerBank.current += playerWager;
                setPlayerWager(0);
                setDisableChips(false);
                setCallOrBet("Call");
                return;
            }
            default: {
                return console.warn("We're having handleClick issues, somehow");
            }
        }
    }

    function handleCardClick([suit, value]) {
        if (phase.current === "discard") {
            playerHand.current.forEach((card) => {
                if (card.Suit === suit && card.Value === value) {
                    card.Selected = true;
                }
            });

            buildPlayerHand();

            toggleCardSelect(!cardSelect);
        }
    }

    return (
        <div className="cardtable-container">
            {/* DEALER PLAY AREA */}
            <div className="dealer-container">
                <div className="dealer-bank">
                    Dealer Bank: ${dealerBank.current}
                </div>
                <div className="playing-cards-container">{dealerCards}</div>
            </div>

            <div className="center-container">
                <div className="bet-container">
                    {/* DEALER WAGER */}
                    <div className="dealer-wager">
                        Dealer's Wager: {dealerWager.current}
                    </div>
                    {/* BET POOL */}
                    <div className="pot-container">Pot: {pot}</div>
                    {/* PLAYER WAGER */}
                    <div className="player-wager-container">
                        Current Wager: {playerWager}
                    </div>
                </div>
                <div
                    className="draw-button-container"
                    // style={{ display: drawBtnDisplay.current }}
                >
                    <button
                        className="draw-button"
                        onClick={() => handleClick("Draw")}
                    >
                        Draw
                    </button>
                </div>
            </div>

            {/* PLAYER PLAY AREA */}
            <div className="player-container">
                <div className="playing-cards-container">{playerCards}</div>
                {/* CALL/FOLD/CLEAR BUTTONS */}
                <div
                    className="calls-container"
                    style={
                        {
                            // display: drawBtnDisplay === "none" ? "flex" : "none",
                        }
                    }
                >
                    {/* CALL/BET BUTTON */}
                    {/* GOAL: the button will change from CALL to BET when the player's bet is greater than the dealer's */}
                    <button
                        className="call-bet"
                        disabled={disableBtns}
                        onClick={() => handleClick(callOrBet)}
                    >
                        {callOrBet}
                    </button>
                    {/* BET BUTTON */}
                    <button
                        className="fold"
                        disabled={disableBtns}
                        onClick={() => handleClick("Fold")}
                    >
                        Fold
                    </button>
                    <button
                        className="clearWager"
                        disabled={disableBtns}
                        onClick={() => handleClick("Clear")}
                    >
                        Clear
                    </button>
                </div>

                {/* POKER CHIP CONTAINER */}
                <div
                    className="chip-container"
                    style={{
                        display: drawBtnDisplay === "none" ? "none" : "flex",
                    }}
                >
                    <div className="chip-holder">
                        {/* ALLOWS PLAYER TO BET THEIR ENTIRE BANK */}
                        <button
                            className="all-in"
                            id="chip"
                            disabled={disableChips}
                            onClick={() => addWager("all")}
                        >
                            All In
                        </button>
                        {/* BETS $100 */}
                        <button
                            className="hundred-dollar"
                            id="chip"
                            disabled={disableChips}
                            onClick={() => addWager("hundred")}
                        >
                            $100
                        </button>
                        {/* BETS $50 */}
                        <button
                            className="fifty-dollar"
                            id="chip"
                            disabled={disableChips}
                            onClick={() => addWager("fifty")}
                        >
                            $50
                        </button>
                        {/* BETS $25 */}
                        <button
                            className="twenty-five-dollar"
                            id="chip"
                            disabled={disableChips}
                            onClick={() => addWager("twenty-five")}
                        >
                            $25
                        </button>
                    </div>
                    <div
                        className="chip-spacer"
                        style={{
                            display:
                                drawBtnDisplay.current === "none"
                                    ? "none"
                                    : "block",
                            height: "3em",
                        }}
                    ></div>
                </div>
                {/* PLAYER'S REMAINING MONEY */}
                <div className="player-bank">Bank: ${playerBank.current}</div>
            </div>
        </div>
    );
}
