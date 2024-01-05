import React from 'react';

import { FaStar, FaStarHalf } from 'react-icons/fa';

const HalfStar = ({ color }) => (
    <span style={{ position: 'relative', display: 'inline-block' }}>
      <FaStarHalf color={color} />
      <FaStar color="lightgray" style={{ position: 'absolute', top: 0, left: 0 }} />
    </span>
); // for the stars to overlap

const StarRating = ({ averageRating }) => {

    const filledStars = Math.floor(averageRating);
    const hasHalfStar = (averageRating % 1) !== 0;

    return (
        <div>
            {[...Array(filledStars)].map((_, index) => (
                <FaStar key={index} color="purple" />
            ))}
            {hasHalfStar && <HalfStar color="purple" />}
            {[...Array(5 - Math.ceil(averageRating))].map((_, index) => (
                <FaStar key={index} color="lightgray" />
            ))}
        </div>
    )
}

export default StarRating;