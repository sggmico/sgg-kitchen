
import React from 'react';
import { Dish } from '../types';

interface DishCardProps {
  dish: Dish;
  showPrice?: boolean;
}

const DishCard: React.FC<DishCardProps> = ({ dish, showPrice = true }) => {
  return (
    <div className="flex flex-col justify-center py-1 sm:py-1.5 group w-full overflow-hidden">
      {/* Top Line: Name + Badge + Price */}
      <div className="flex items-baseline w-full">

        <h3 className={`font-serif font-bold text-baoding-dark whitespace-nowrap overflow-hidden text-ellipsis ${showPrice ? 'text-xs sm:text-sm lg:text-base' : 'text-xs sm:text-sm'}`}>
          {dish.name}
        </h3>

        {/* Popular Badge - Displayed immediately after name */}
        {dish.popular && (
          <span className="text-[8px] sm:text-[9px] bg-baoding-red text-white px-0.5 sm:px-1 rounded-sm font-serif whitespace-nowrap shrink-0 ml-0.5 sm:ml-1 self-center relative -top-[1px]">
            招牌
          </span>
        )}

        {/* Dot Leader - Only show if price is visible */}
        {showPrice && (
          <div className="flex-1 mx-0.5 sm:mx-1 border-b-2 border-dotted border-baoding-gold/40 relative -top-1 min-w-[10px]"></div>
        )}

        {/* Price */}
        {showPrice && (
          <div className="text-sm sm:text-base lg:text-lg font-bold text-baoding-red font-serif whitespace-nowrap shrink-0 ml-auto">
            <span className="text-[10px] sm:text-xs mr-0.5">¥</span>{dish.price}
          </div>
        )}
      </div>

      {/* Bottom Line: Description + Spicy */}
      <div className="flex items-center w-full mt-0.5">
        <p className="text-[9px] sm:text-[10px] text-stone-500 font-serif truncate w-full">
          {dish.description}
          {dish.spicyLevel !== undefined && dish.spicyLevel > 0 && (
             <span className="text-[9px] sm:text-[10px] ml-0.5 sm:ml-1 shrink-0 grayscale-[0.3]">
               {'🌶️'.repeat(dish.spicyLevel)}
             </span>
          )}
        </p>
      </div>
    </div>
  );
};

export default DishCard;
