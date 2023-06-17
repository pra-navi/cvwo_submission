import React from 'react';

import { FaStar } from 'react-icons/fa';

const StarRating = ({ averageRating }) => {

    const filledStars = Math.floor(averageRating);
    const hasHalfStar = (averageRating % 1) !== 0;

    return (
        <div>
            {[...Array(filledStars)].map((_, index) => (
                <FaStar key={index} color="purple" />
            ))}
            {hasHalfStar && <FaStar half color="purple" />}
            {[...Array(5 - Math.ceil(averageRating))].map((_, index) => (
                <FaStar key={index} color="lightgray" />
            ))}
        </div>
    )
}

export default StarRating;