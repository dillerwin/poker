import { useRef } from "react";

export const getDeck = () => {
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
                Selected: false,
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

//FIXME: is allowing discarded cards back into hands

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
        //FIXME: not discarding all Selected cards
        if (card.Selected) {
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

//returns boolean
//if checking both players, true means player won, false means dealer won
export const evaluateHands = (dealerHand, playerHand, phase) => {
    let dealerScore = checkHand(dealerHand),
        playerScore = undefined;

    if (playerHand) {
        playerScore = checkHand(playerHand);

        if (
            //if both players have only a high card
            typeof dealerScore !== "number" &&
            typeof playerScore !== "number"
        ) {
            //if somehow they have the *same* high card
            //tie here goes to the player
            if (dealerScore[0] === playerScore[0]) {
                return dealerScore[1] < playerScore[1];
            } else {
                return dealerScore[0] < playerScore[0];
            }
        } else {
            if (
                //if player has high card & dealer has score
                typeof dealerScore === "number" &&
                typeof playerScore !== "number"
            ) {
                return false;
            } else if (
                //if dealer has high card & player has score
                typeof dealerScore !== "number" &&
                typeof playerScore === "number"
            ) {
                return true;
            } else {
                //if both have score
                return dealerScore < playerScore;
            }
        }
    } else {
        if (typeof dealerScore !== "number") {
            //TODO: logic to have dealer decide to fold or bluff, since they don't got shit
        } else {
            //TODO: logic to have dealer decide to fold, bluff, or bet based on... I think score, maybe
            // also based on remaining bank? Would probably need to be passed back up for that, or have bank
            // passed in here
        }
    }
};

const checkHand = (hand) => {
    let royalFlush = false, //done
        straightFlush = false, //done
        fourKind = false, //done
        fullHouse = false, //done
        flush = false, //done
        straight = false, //done
        threeKind = false, //done
        twoPair = false, //done
        pair = false, //done
        highCard = undefined, //done
        nextHigh = undefined; //done

    let score = 0;

    function getNextHigh(highCard, values) {
        values.splice(highCard, 1);

        return values.findLastIndex((el) => el > 0);
    }

    let values = new Array(14),
        suits = new Array(4),
        straightCheck = 0;

    values.fill(0);
    suits.fill(0);

    hand.forEach((card) => {
        if (isNaN(card.Value)) {
            if (card.Value === "J") {
                values[11]++;
            } else if (card.Value === "Q") {
                values[12]++;
            } else if (card.Value === "K") {
                values[13]++;
            } else if (card.Value === "A") {
                values[1]++;
            }
        } else {
            values[card.Value]++;
        }
        if (card.Suit === "DIAMOND") {
            suits[0]++;
        } else if (card.Suit === "CLUB") {
            suits[1]++;
        } else if (card.Suit === "HEART") {
            suits[2]++;
        } else if (card.Suit === "SPADE") {
            suits[3]++;
        }
    });

    //if any suit has 5, that's a flush
    if (suits.includes(5)) {
        flush = true;
    }

    for (let i = 0; i < values.length; i++) {
        //checking to see if there's a straight
        //the values would all be in a row and all would equal 1
        values[i] === 1 ? straightCheck++ : (straightCheck = 0);

        //if there's a straight, there aren't any other matches, so exits loop
        if (straightCheck === 5) {
            straight = true;
            break;
        }

        // if any value is 2, that's a pair
        if (values[i] === 2) {
            // if pair is already true, there's is two pair
            if (pair) {
                twoPair = true;
                pair = false;
            } else {
                //if there's already 3 of a kind, that makes a full house
                if (threeKind) {
                    fullHouse = true;
                } else {
                    //else just a pair
                    pair = true;
                }
            }
        }
        //if value is 3, there's 3 of a kind
        if (values[i] === 3) {
            if (pair) {
                pair = false;
                fullHouse = true;
            } else {
                threeKind = true;
            }
        }
        //if value is 4, there's 4 of a kind
        if (values[i] === 4) {
            fourKind = true;
        }
    }

    //if straight and flush are both true, that's a straight flush baybee
    if (straight && flush) {
        straight = false;
        flush = false;
        straightFlush = true;
    }

    //
    if (flush) {
        if (values[0] && values[11] && values[12] && values[13]) {
            flush = false;
            royalFlush = true;
        }
    }

    //tally playerScore
    if (royalFlush) {
        score = 250;
    } else if (straightFlush) {
        score = 200;
    } else if (fourKind) {
        score = 150;
    } else if (fullHouse) {
        score = 100;
    } else if (flush) {
        score = 90;
    } else if (straight) {
        score = 80;
    } else if (threeKind) {
        score = 70;
    } else if (twoPair) {
        score = 50;
    } else if (pair) {
        score = 25;
    } else {
        highCard = values.findLastIndex((el) => el > 0);
        nextHigh = getNextHigh(highCard, values);
        score = [highCard, nextHigh];
    }

    if (typeof score === "number") {
        for (let i = 0; i < suits.length; i++) {
            if (suits[i]) {
                score += (i + 1) * 2;
            }
        }
    }

    return score;
};
