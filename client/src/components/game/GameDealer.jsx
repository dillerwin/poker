import { useEffect, useRef } from "react";
import { useState } from "react";

export default function GameDealer({ currentImg }) {
    return (
        <div className="game-dealer-container">
            <img
                className="dealerImg"
                alt="dealer"
                // TODO: change this back to { currentImg }
                src={currentImg.image}
                // src="https://www.fillmurray.com/80/120"
            />
        </div>
    );
}
