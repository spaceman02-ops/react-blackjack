const ranks = {
    ace: 11,
    2: 2,
    3: 3,
    4: 4,
    5: 5,
    6: 6,
    7: 7,
    8: 8,
    9: 9,
    10: 10,
    jack: 10,
    queen: 10,
    king: 10,
};

const suits = ["hearts", "spades", "clubs", "diamonds"];

class Card {
    constructor(rank, suit, value) {
        this.rank = rank;
        this.suit = suit;
        this.value = value;
        this.name = `${this.rank} of ${this.suit}`;
        this.image = `${this.rank}_of_${this.suit}.png`;
    }
}

function getDeck(ranks, suits) {
    let deck = [];
    for (const [rank, value] of Object.entries(ranks)) {
        for (let suit of suits) {
            deck.push(new Card(rank, suit, value));
        }
    }
    return deck;
}

const deck = getDeck(ranks, suits);

export { deck };
