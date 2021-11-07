import { useCallback, useEffect, useState } from "react";
import "./App.css";
import { deck } from "./data/cards";
function App() {
    const [hand, sethand] = useState([]);
    const [active, setactive] = useState(false);
    const [dealer, setdealer] = useState([]);
    const [stay, setStay] = useState(false);
    const [dealerstay, setdealerstay] = useState(false);
    const [gameover, setgameover] = useState(false);
    const [money, setmoney] = useState(25);
    const [bet, setbet] = useState(1);

    const evalGame = useCallback(
        function evalGame() {
            function pAlert(str) {
                setTimeout(() => alert(str), 2000);
            }

            function endGame(type) {
                switch (type) {
                    case "dealerbust":
                        pAlert("Dealer busts!");
                        setmoney(bet + money);
                        break;
                    case "playerbust":
                        pAlert("Player busts!");
                        setmoney(money - bet);
                        break;
                    case "dealerwin":
                        pAlert("Dealer wins!");
                        setmoney(money - bet);
                        break;
                    case "playerwin":
                        pAlert("Player wins!");
                        setmoney(bet + money);
                        break;
                    case "dealerblackjack":
                        pAlert("Blackjack! Dealer wins!");
                        setmoney(money - bet);
                        break;
                    case "playerblackjack":
                        pAlert("Blackjack! Player wins!");
                        setmoney(bet + money);
                        break;
                    default:
                        pAlert("error!");
                        break;
                }
                setgameover(true);
            }

            if (!gameover) {
                let pTotal = totalHand(hand);
                let dTotal = totalHand(dealer);
                if (hand.length === 2 && dealer.length === 2) {
                    if (dTotal === 21) {
                        endGame("dealerblackjack");
                        return;
                    }

                    if (pTotal === 21) {
                        endGame("playerblackjack");
                        return;
                    }
                }
                if (!stay || !dealerstay) {
                    if (pTotal > 21) {
                        endGame("playerbust");
                        return;
                    }
                    if (dTotal > 21) {
                        endGame("dealerbust");
                        return;
                    }
                }
                if (stay && dealerstay) {
                    if (pTotal > 21) {
                        endGame("playerbust");
                        return;
                    }
                    if (dTotal > 21) {
                        endGame("dealerbust");
                        return;
                    }
                    if (dTotal >= pTotal) {
                        endGame("dealerwin");
                        return;
                    } else {
                        endGame("playerwin");
                        return;
                    }
                }
            }
        },
        [hand, dealer, stay, dealerstay, gameover, bet, money]
    );

    useEffect(() => {
        evalGame();
    });

    function drawCards(numOfCards) {
        let cards = [];
        for (let i = 0; i < numOfCards; i++) {
            let random = Math.floor(Math.random() * deck.length);
            cards.push(deck[random]);
        }
        return cards;
    }

    function newHand() {
        return drawCards(2);
    }
    function handleNewGame() {
        setactive(false);
        setbet(0);
        let h = newHand();
        let d = newHand();
        sethand(h);
        setdealer(d);
        setStay(false);
        setdealerstay(false);
    }
    function handleDeal() {
        setactive(true);
        setgameover(false);
    }
    function handleBet() {
        if (!active) {
            let b = bet;
            b++;
            setbet(b);
        }
    }
    function handleHit() {
        let h = [...hand];
        let card = drawCards(1);
        h.push(...card);
        sethand(h);
        console.log("Player hits!");
    }

    async function handleStay() {
        setStay(true);
        await dealerTurn();
    }

    function dealerHit(d) {
        let card = drawCards(1);
        d.push(...card);
        console.log("Dealer hits!");
        return d;
    }

    async function dealerTurn() {
        let d = [...dealer];
        let total = totalHand(d);

        while (total < 17) {
            d = dealerHit(d);
            total = totalHand(d);
        }

        setdealer(d);
        setdealerstay(true);
    }

    function totalHand(h) {
        let total = h.reduce((acc, cur) => {
            return acc + cur.value;
        }, 0);
        if (total > 21 && h.some((i) => i.value === 11)) {
            let aces = h.filter((i) => i.value === 11);
            total = total - 10 * aces.length;
        }
        return total;
    }

    function displayHand(h) {
        let display = h.map((i, v) => (
            <img className="card" src={i.image} key={v} alt={i.name} />
        ));
        return display;
    }
    const blankCard = (
        <img className="card dealer" src="back.png" key="1001" alt="back" />
    );
    const fullDealer = displayHand(dealer);
    let dealerDisplay = [blankCard, fullDealer.slice(1, fullDealer.length)];
    if (gameover) {
        dealerDisplay = fullDealer;
    }
    const playerDisplay = displayHand(hand);

    return (
        <div className="deckContainer">
            <div className="buttonContainer">
                <div className="button" onClick={handleNewGame}>
                    New Game!
                </div>
                <div className="button" onClick={handleDeal}>
                    Deal me in!
                </div>
                <div className="button" onClick={handleHit}>
                    Hit me!
                </div>
                <div className="button" onClick={handleStay}>
                    I stay!
                </div>
                <div className="button" onClick={handleBet}>
                    Bet+
                </div>
            </div>
            {active && (
                <div className="handContainer">
                    <div className="dealerHand">{dealerDisplay}</div>
                    {/* <p>{totalHand(dealer).toString()}</p> */}
                    <div className="playerHand">{playerDisplay}</div>
                    <h2>Your total is: {totalHand(hand).toString()}</h2>
                </div>
            )}
            <h2>Your bet is: {bet}</h2>
            <h2>You have ${money}</h2>
        </div>
    );
}

export default App;
