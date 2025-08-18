import React from 'react';
import { assets } from '../assets/assets';

const StarRating = ({ rating, size = 'w-4 h-4' }) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  
  for (let i = 0; i < fullStars; i++) {
    stars.push(
      <img 
        key={`full-${i}`} 
        src={assets.star_icon} 
        alt="star" 
        className={size} 
      />
    );
  }
  
  if (hasHalfStar) {
    stars.push(
      <img 
        key="half" 
        src={assets.star_icon} 
        alt="half star" 
        className={`${size} opacity-50`} 
      />
    );
  }
  
  const emptyStars = 5 - Math.ceil(rating);
  for (let i = 0; i < emptyStars; i++) {
    stars.push(
      <img 
        key={`empty-${i}`} 
        src={assets.star_dull_icon} 
        alt="empty star" 
        className={size} 
      />
    );
  }
  
  return <div className="flex items-center gap-1">{stars}</div>;
};

export default StarRating;
