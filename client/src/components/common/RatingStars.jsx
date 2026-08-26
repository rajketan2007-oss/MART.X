import React from 'react';
import { Star } from 'lucide-react';

const RatingStars = ({ rating = 0, numReviews, size = 'sm' }) => {
  const iconSize = size === 'lg' ? 'w-5 h-5' : size === 'xs' ? 'w-3 h-3' : 'w-3.5 h-3.5';

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center bg-emerald-700 text-white font-bold px-1.5 py-0.5 rounded text-[11px] gap-1 shadow-2xs">
        <span>{Number(rating).toFixed(1)}</span>
        <Star className={`${iconSize} fill-white stroke-none`} />
      </div>
      {numReviews !== undefined && (
        <span className="text-xs text-extrad-muted font-medium ml-1">
          ({numReviews})
        </span>
      )}
    </div>
  );
};

export default RatingStars;
