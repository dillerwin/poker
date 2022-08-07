/** @format */

import { useEffect, useRef } from "react";
import { useState } from "react";

export default function GameDealer({ currentImg }) {
    return (
        <div className="game-dealer-container">
            <img className="dealerImg" alt="dealer" src={currentImg.image} />
        </div>
    );
}
