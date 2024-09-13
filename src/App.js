import { useEffect, useState, useRef } from "react";
import {
   Dialog,
   DialogActions,
   DialogContent,
   DialogContentText,
   Button,
   DialogTitle
   } from "@mui/material";

import Card from "./Card";
import './App.scss';

const uniqueElementsArray = [
  {
    type: "react",
    image: require(`./images/react.png`)
  },
  {
    type: "node",
    image: require(`./images/node.png`)
  },
  {
    type: "vue",
    image: require(`./images/vue.png`)
  },
  {
    type: "tailwind",
    image: require(`./images/tailwind.png`)
  },
  {
    type: "html",
    image: require(`./images/html.png`)
  },
  {
    type: "css",
    image: require(`./images/css.png`)
  }
];

function shuffleCards(array) {
  const length = array.length;
  for(let i = length; i>0; i--){
    const randomIndex = Math.floor(Math.random() * i);
    const currentIndex = i-1;
    const temp = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temp;
  }
  return array;
}

export default function App() {
  const [cards, setCards] = useState(
    shuffleCards.bind(null, uniqueElementsArray.concat(uniqueElementsArray))
  );
  const [openCards, setOpenCards] = useState([]);
  const [clearedCards, setClearedCards] = useState({});
  const [shouldDisableAllCards, setShouldDisableAllCards] = useState(false);
  const [moves, setMoves] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [bestScore, setBestScore] = useState(
    JSON.parse(localStorage.getItem("bestScore")) || Number.POSITIVE_INFINITY
  );
  const timeout = useRef(null);

  const disable = () => {
    setShouldDisableAllCards(true);
  };
  const enable = () => {
    setShouldDisableAllCards(false);
  };

  const checkCompletion = () => {
    if (Object.keys(clearedCards).length === uniqueElementsArray.length){
      setShowModal(true);
      const highScore = Math.min(moves, bestScore);
      setBestScore(highScore);
      localStorage.setItem("bestScore", highScore);
    }
  };
  const evaluate = () => {
    const [first, second] = openCards;
    enable();
    if(cards[first].type === cards[second].type){
      setClearedCards((prev)=>({...prev, [cards[first].type]: true}));
      setOpenCards([]);
      return;
    }
    timeout.current = setTimeout(() =>{
      setOpenCards([]);
    }, 500);
  };

  const handleCardClick = (index) => {
    if(openCards.length === 1) {
      setOpenCards((prev)=>[...prev, index]);
      setMoves((moves) => moves + 1);
      disable();
    }else{
      clearTimeout(timeout.current);
      setOpenCards([index]);
    }
  };

  // const handleCardClick = (index) => {
  //   setOpenCards((prevOpenCards) => {
  //     if (prevOpenCards.length === 1) {
  //       const newOpenCards = [...prevOpenCards, index];
  //       setMoves((moves) => moves + 1);
  //       disable(); // Make sure this function correctly disables cards
  //       return newOpenCards;
  //     } else {
  //       clearTimeout(timeout.current);
  //       return [index];
  //     }
  //   });
  // };

  useEffect(()=>{
    let timeout = null;
    if(openCards.length === 2){
      timeout = setTimeout(evaluate, 300);
    }
    return () => {
      clearTimeout(timeout);
    };
  }, [openCards]);

  useEffect(()=>{
    checkCompletion();
  }, [clearedCards]);
  const checkIsFlipped = (index) => {
    return openCards.includes(index);
  };

  const checkIsInactive = (card) => {
    return Boolean(clearedCards[card.type]);
  };

  const handleRestart = () => {
    setClearedCards({});
    setOpenCards([]);
    setShowModal(false);
    setMoves(0);
    setShouldDisableAllCards(false);
    setCards(shuffleCards(uniqueElementsArray.concat(uniqueElementsArray)));
  };

  return (
    <div className="App">
      <header>
        <h3>Play the flip card game</h3>
        <div>
          Select two cards with same content to get points
        </div>
      </header>
      <div className="container">
        {cards.map((card, index) => {
          return (
            <Card
              key = {index}
              card={card}
              index={index}
              isDisabled={shouldDisableAllCards}
              isInactive={checkIsInactive(card)}
              isFlipped={checkIsFlipped(index)}
              onClick={handleCardClick}
            />
          );
        })}
      </div>
      <footer>
        <div className="score">
          <div className="moves">
            <span className="bold">Moves:</span> {moves}
          </div>
          {localStorage.getItem("bestScore") && (
            <div className="high-score">
              <span className="bold">Best Score</span> {bestScore}
            </div>
          )}
        </div>
        <div className="restart">
          <Button onClick={handleRestart} color="primary" variant="contained">Restart</Button>
        </div>
      </footer>
      <Dialog
        open={showModal}
        disableBackdropClick
        disableEscapeKeyDown
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            Hurray!!! You Completed the challenge
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              You completed the game in {moves} moves. Your best score is{" "} {bestScore} moves.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleRestart} color="primary">Restart</Button>
          </DialogActions>
        </Dialog>
    </div>
  );
}



