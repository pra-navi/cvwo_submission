import { FlipToFront, RotateLeft } from '@material-ui/icons';
import React from 'react';

import { FaStar, FaStarHalf } from 'react-icons/fa';

interface StarRatingProps {
    averageRating: number;
}

const StarRating: React.FC<StarRatingProps> = ({ averageRating }) => {

    const filledStars = Math.floor(averageRating);
    const hasHalfStar = (averageRating % 1) !== 0;

    return (
        <div>
            {[...Array(filledStars)].map((_, index) => (
                <FaStar key={index} color="purple" />
            ))}
            {hasHalfStar && <FaStarHalf color="purple" />}
            {[...Array(5 - Math.ceil(averageRating))].map((_, index) => (
                <FaStar key={index} color="lightgray" />
            ))}
        </div>
    )
}

export default StarRating;