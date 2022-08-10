import { useRef } from "react";

//TODO: add scoring for hands. Ties (very slight possibility) should go to the player
/*
    hands are scored in this order:
    Royal Flush - 250
    Straight Flush - 200
    4 of a kind - 150
    Full House - 100
    Flush - 90 
    Straight - 80
    3 of a kind - 70
    2 pair - 50
    1 pair - 25
    high card - 10
*/

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
                Show: null,
                Hold: false,
            };
            deck.push(card);
        }
    }
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
export const draw = (deck, number, user, hand) => {
    //initial draw at the top of the round
    if (!hand) {
        let buildHand = [];
        for (let i = 0; i < number; i++) {
            let rand = Math.floor(Math.random() * deck.length);
            let card = deck.splice(rand, 1);
            buildHand.push(card[0]);
        }
        if (user === "player") {
            buildHand.forEach((card) => (card.Show = true));
        } else {
            buildHand.forEach((card) => (card.Show = false));
        }
        return buildHand;
    } else {
        //discard phase

        for (let i = 0; i < number; i++) {
            let rand = Math.floor(Math.random() * deck.length);
            let card = deck.splice(rand, 1);
            hand.push(card[0]);
        }
        if (user === "player") {
            hand.forEach((card) => (card.Show = true));
        } else {
            hand.forEach((card) => (card.Show = false));
        }
        return [deck, number, user, hand];
    }
};

export const discard = (deck, user, hand) => {
    let count = 0;
    hand.forEach((card, idx) => {
        if (!hand.Hold) {
            hand.splice(idx, 1);
            count++;
        }
    });
    try {
        draw(deck, count, user, hand);
        return true;
    } catch (e) {
        console.warn("oofda, discard's draw call failed for some reason");
        return false;
    }
};

//  GOAL: this will judge both hands and determine a winner
//  - think I'm not gonna include a cheatsheet for the player on if a hand has potential, they'll just need to read their hand lol
//  - will also be called for dealer to determine which cards to discard/hold during draw phase
// for now, is just returning true, the house never wins lol

export const evaluateHands = (playerHand, dealerHand, phase) => {
    // console.group("evaluating hands");
    // console.log("playerHand", playerHand);
    // console.log("dealerHand", dealerHand);
    // console.log("phase", phase);
    // console.groupEnd();

    return true;
};
