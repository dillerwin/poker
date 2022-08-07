import { useRef } from "react";
import "./cardResource/BACK.svg";

export const getDeck = () => {
    console.log("getDeck firing");
    const suits = ["SPADE", "DIAMOND", "CLUB", "HEART"];
    const values = [
        "A",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "10",
        "J",
        "Q",
        "K",
    ];

    let deck = [];
    for (let i = 0; i < suits.length; i++) {
        for (let x = 0; x < values.length; x++) {
            let card = {
                Suit: suits[i],
                Value: values[x],
                Face: null,
                Back: null,
            };
            deck.push(card);
        }
    }
    console.log("deck before return", deck);
    return deck;
};

export const shuffle = (deck) => {
    for (let i = 0; i < 1000; i++) {
        let loc1 = Math.floor(Math.random() * deck.length);
        let loc2 = Math.floor(Math.random() * deck.length);
        let tempLoc = deck[loc1];

        deck[loc1] = deck[loc2];
        deck[loc2] = tempLoc;
    }
    return deck;
};

/**
 * @param deck
 * @param number
 */
export const draw = (deck, number) => {
    let handOne = [];
    let handTwo = [];
    for (let i = 0; i < number * 2; i++) {
        let rand = Math.floor(Math.random() * deck.length);
        let card = deck.splice(rand, 1);

        if (number % 2 === 0) {
            handOne.push(card);
        } else {
            handTwo.push(card);
        }
    }
    return { handOne: handOne, handTwo: handTwo };
};
