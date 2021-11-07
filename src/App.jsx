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

    const showDown = useCallback(
        function showDown() {
            let pTotal = totalHand(hand);
            let dTotal = totalHand(dealer);
            setTimeout(() => {
                if (dTotal >= pTotal) {
                    alert("You lose!");
                } else {
                    alert("You win!");
                }
                setgameover(true);
            }, 500);
        },
        [hand, dealer]
    );

    useEffect(() => {
        if (stay && dealerstay && !gameover) {
            showDown();
        }
    }, [dealerstay, stay, showDown, gameover]);

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

    function handleDeal() {
        let h = newHand();
        let d = newHand();
        sethand(h);
        setdealer(d);
        setactive(true);
        setStay(false);
        setdealerstay(false);
        setgameover(false);
    }

    function handleHit() {
        let h = [...hand];
        let card = drawCards(1);
        h.push(...card);
        sethand(h);
        console.log("Player hits!");
        if (bustCheck(h)) {
            alert("You lose!");
            setgameover(true);
        }
    }

    function handleStay() {
        setStay(true);
        dealerTurn();
    }

    function dealerHit(d) {
        let card = drawCards(1);
        d.push(...card);
        console.log("Dealer hits!");
        if (bustCheck(d)) {
            alert("You win!");
            setgameover(true);
            return d;
        } else {
            return d;
        }
    }

    function dealerTurn() {
        let d = [...dealer];
        let total = totalHand(d);

        while (total <= 15) {
            d = dealerHit(d);
            console.log(d);
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

    function bustCheck(h) {
        let total = totalHand(h);
        return total > 21;
    }

    function displayHand(h) {
        let display = h.map((i, v) => (
            <img className="card" src={i.image} key={v} alt={i.name} />
        ));
        return display;
    }
    const blankCard = (
        <img className="card" src="back.png" key="1001" alt="back" />
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
                <div className="button" onClick={handleDeal}>
                    Deal me in!
                </div>
                <div className="button" onClick={handleHit}>
                    Hit me!
                </div>
                <div className="button" onClick={handleStay}>
                    I stay!
                </div>
            </div>
            {active && (
                <div className="handContainer">
                    <div className="dealerHand">{dealerDisplay}</div>
                    <p>{totalHand(dealer).toString()}</p>
                    <div className="playerHand">{playerDisplay}</div>
                    <p>{totalHand(hand).toString()}</p>
                </div>
            )}
        </div>
    );
}

export default App;
