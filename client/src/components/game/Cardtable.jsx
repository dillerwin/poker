import { useEffect } from "react";
import { useRef, useState } from "react";
import { getDeck, shuffle, draw, discard, evaluateHands } from "./Cards";

export default function Cardtable({ advDealer }) {
    // const [winStatus, setWinStatus] = useState();
    const [pot, setPot] = useState(0);
    const [lastBet, setLastBet] = useState("");
    const [disableBtns, setDisableBtns] = useState(false);
    const [disableChips, setDisableChips] = useState(false);
    const [callOrBet, setCallOrBet] = useState("Call");
    const [cardSelect, toggleCardSelect] = useState(false);
    const [resultBubble, setResultBubble] = useState("");

    //playerCards/dealerCards are the visible cards on the table
    const [playerCards, setPlayerCards] = useState([]);
    const [dealerCards, setDealerCards] = useState([]);

    let dealerBank = useRef(1000);
    let playerBank = useRef(1000);
    let playerWager = useRef(0);
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
            buildPlayerHand();
            buildDealerHand();

            phase.current = "ante";
        } else if (phase.current === "ante") {
            setTimeout(() => {
                playerBank.current -= 25;
                dealerBank.current -= 25;
                setPot(50);
                playerBank.current !== 0 || dealerBank.current !== 0
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
                playerWager.current = playerWager.current + playerBank.current;
                playerBank.current = 0;
                setDisableChips(true);
                setLastBet("all");
                return;
            }
            case "hundred": {
                if (playerBank.current - 100 > 0) {
                    playerWager.current = playerWager.current + 100;
                    playerBank.current -= 100;
                } else {
                    playerWager.current = playerWager + playerBank.current;
                    playerBank.current = 0;
                    setDisableChips(true);
                }
                setLastBet("hundred");
                return;
            }
            case "fifty": {
                if (playerBank.current - 50 > 0) {
                    playerWager.current = playerWager.current + 50;
                    playerBank.current -= 50;
                } else {
                    playerWager.current =
                        playerWager.current + playerBank.current;
                    playerBank.current = 0;
                    setDisableChips(true);
                }
                setLastBet("fifty");
                return;
            }
            case "twenty-five": {
                if (playerBank.current - 25 > 0) {
                    playerWager.current = playerWager.current + 25;
                    playerBank.current -= 25;
                } else {
                    playerWager.current =
                        playerWager.current + playerBank.current;
                    playerBank.current = 0;
                    setDisableChips(true);
                }
                setLastBet("twenty-five");
                return;
            }
            default: {
                return console.error("Danger Will Robinson");
            }
        }
    }

    function endPhase(fold) {
        console.warn("at endPhase, phase:", phase.current);

        switch (phase.current) {
            case "eval": {
                return null;
            }
            case "bet": {
                setTimeout(() => {
                    if (dealerBank.current - playerWager.current < 0) {
                        let betGap = playerWager.current - dealerBank.current;
                        playerBank.current += betGap;
                        playerWager.current = dealerBank.current;
                        dealerWager.current = dealerBank.current;
                        dealerBank.current = 0;
                    } else {
                        dealerWager.current = playerWager.current;
                        dealerBank.current -= dealerWager.current;
                    }
                    phase.current = "discard";
                    drawBtnDisplay.current = "flex";
                    setPot(pot + playerWager.current + dealerWager.current);
                    playerWager.current = 0;
                    dealerWager.current = 0;
                    setCallOrBet("Call");
                    setDisableChips(true);
                    setDisableBtns(true);
                }, 500);

                return null;
            }
            case "discard": {
                //TODO: this should not take a playerHand, just dealerHand
                // should then evaluate dealer's hand and decide what card to keep/discard
                let evaluate = evaluateHands(
                    dealerHand.current,
                    playerHand.current,
                    phase.current
                );

                if (evaluate) {
                    console.log("evaluate", evaluate);
                }

                phase.current = "discard";
                drawBtnDisplay.current = "none";
                phase.current = "draw";
                endPhase();
                return null;
            }
            case "draw": {
                playerHand.current = discard(
                    deck.current,
                    "player",
                    playerHand.current
                );
                dealerHand.current = discard(
                    deck.current,
                    "dealer",
                    dealerHand.current
                );
                phase.current = "bet2";
                setTimeout(() => {
                    buildPlayerHand();
                    buildDealerHand();
                    setCallOrBet("Call");
                    playerBank.current !== 0 && dealerBank.current !== 0
                        ? setDisableChips(false)
                        : setDisableChips(true);
                    setDisableBtns(false);
                }, 500);

                return null;
            }
            case "bet2": {
                setTimeout(() => {
                    if (dealerBank - playerWager.current < 0) {
                        let temp = playerWager.current - dealerBank;
                        playerBank += temp;
                        playerWager.current = playerWager.current - temp;
                        dealerWager.current = dealerBank.current;
                        dealerBank.current = 0;
                    } else {
                        dealerWager.current = playerWager.current;
                        dealerBank.current -= playerWager.current;
                    }
                    setPot(pot + playerWager.current + dealerWager.current);
                    playerWager.current = 0;
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
                let evaluate = undefined;
                if (fold) {
                    evaluate = false;
                } else {
                    evaluate = evaluateHands(
                        dealerHand.current,
                        playerHand.current,
                        phase.current
                    );
                }

                dealerHand.current.forEach((card) => (card.Show = true));
                buildDealerHand();

                console.log("evaluate", evaluate);
                if (evaluate) {
                    playerBank.current += pot;
                    setPot(0);
                    if (dealerBank.current <= 0) {
                        advDealer();
                        dealerBank.current = 1000;
                    }
                    buildResultBubble("You win!");
                    setDisableChips(true);
                    setDisableBtns(true);
                    if (dealerBank.current <= 0) {
                        advDealer();
                        dealerBank.current = 1000;
                    }
                    setCallOrBet("Call");
                } else {
                    dealerBank.current += pot;
                    setPot(0);
                    fold
                        ? buildResultBubble("You folded")
                        : buildResultBubble("You lost");
                    setDisableBtns(true);
                    setDisableChips(true);
                    setCallOrBet("Call");
                    if (playerBank.current === 0) {
                        //TODO: insert "hard loss" logic here
                        //for now:
                        playerBank.current = 1000;
                    }
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
            case "Fold": {
                if (playerWager.current !== 0) {
                    playerBank.current += playerWager.current;
                }
                playerWager.current = 0;
                phase.current = "end";
                endPhase(true);
                return;
            }
            case "Clear": {
                playerWager.current = 0;
                setDisableChips(false);
                setCallOrBet("Call");
                return;
            }
            case "New": {
                phase.current = "begin";
                setResultBubble(null);
                return;
            }
            default: {
                endPhase();
            }
        }
    }

    function handleCardClick([suit, value]) {
        if (phase.current === "discard") {
            playerHand.current.forEach((card) => {
                if (card.Suit === suit && card.Value === value) {
                    if (card.Selected) {
                        card.Selected = false;
                    } else {
                        card.Selected = true;
                    }
                }
            });
            buildPlayerHand();
            toggleCardSelect(!cardSelect);
        }
    }

    function buildResultBubble(status) {
        if (status) {
            let color = undefined,
                border = undefined;
            if (status.includes("lost") || status.includes("folded")) {
                color = "red";
            } else if (status.includes("win")) {
                color = "green";
            }
            border = `3px ${color} solid`;

            return setResultBubble(
                <div
                    className="resultBubble"
                    style={{ border: border, backgroundColor: color }}
                >
                    {status}
                </div>
            );
        } else {
            return null;
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
                        Current Wager: {playerWager.current}
                    </div>
                </div>
                {/* RESULT BUBBLE */}
                <div className="end-round-container">
                    {resultBubble}
                    {!!resultBubble ? (
                        <button
                            className="newRound"
                            onClick={() => handleClick("New")}
                        >
                            Start Next<br></br>Round
                        </button>
                    ) : null}
                </div>
                <div
                    className="draw-button-container"
                    style={{ display: drawBtnDisplay.current }}
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
