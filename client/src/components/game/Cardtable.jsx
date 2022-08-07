import { useState } from "react";

export default function Cardtable(props) {
    const [winStatus, setWinStatus] = useState();

    function flipCoin() {
        let x = Math.floor(Math.random() * 2);
        if (x === 1) {
            setWinStatus("You won!");
            props.advDealer();
        } else {
            setWinStatus("You lost :(");
        }
    }

    return (
        <div className="cardtable-container">
            <div>This is the play area</div>
            <button className="flipButton" onClick={props.advDealer}>
                Strip!
            </button>
        </div>
    );
}
