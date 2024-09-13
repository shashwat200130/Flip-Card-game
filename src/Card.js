import React from 'react';
import classNames from 'classnames';
import javaScript from './images/javascript.png';
import './Card.scss';


const Card = ({ onClick, card, index, isInactive, isFlipped, isDisabled}) => {
    const handleClick = () => {
        !isFlipped && !isDisabled && onClick(index);
    };

  return (
    <div className={classNames("card",{
        "is-flipped": isFlipped,
        "is-inactive": isInactive
    })}
     onClick={handleClick}
    >
        <div className="card-face card-front-face">
            <img src={javaScript} alt="javaScript"/>
        </div>
        <div className='card-face card-back-face'>
            <img src={card.image} alt="javaScript"/>
        </div>
    </div>
  );
};

export default Card;