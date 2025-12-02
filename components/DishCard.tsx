
import React from 'react';
import { Dish } from '../types';

interface DishCardProps {
  dish: Dish;
  showPrice?: boolean;
  orderMode?: boolean;
  quantity?: number;
  onAddToCart?: (dish: Dish) => void;
  onUpdateQuantity?: (dishId: string, quantity: number) => void;
}

const DishCard: React.FC<DishCardProps> = ({
  dish,
  showPrice = true,
  orderMode = false,
  quantity = 0,
  onAddToCart,
  onUpdateQuantity
}) => {
  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onAddToCart) {
      onAddToCart(dish);
    }
  };

  const handleQuantityChange = (e: React.MouseEvent, delta: number) => {
    e.stopPropagation();
    if (onUpdateQuantity) {
      onUpdateQuantity(dish.id, Math.max(0, quantity + delta));
    }
  };

  return (
    <div className={`flex flex-col justify-center py-1 sm:py-1.5 group w-full overflow-hidden relative`}>
      {/* Popular Watermark Badge */}
      {dish.popular && (
        <div className="absolute inset-0 flex items-center justify-start pl-2 sm:pl-3 opacity-[0.18] pointer-events-none select-none z-0 overflow-hidden">
          <span className="text-baoding-red font-serif font-black text-xl sm:text-2xl lg:text-3xl tracking-wider transform rotate-12 inline-block">
            招牌
          </span>
        </div>
      )}

      {/* Top Line: Name + Order Controls + Price */}
      <div className="flex items-baseline w-full">
        <h3 className={`font-serif font-bold text-baoding-dark whitespace-nowrap overflow-hidden text-ellipsis ${showPrice ? 'text-xs sm:text-sm lg:text-base' : 'text-xs sm:text-sm'}`}>
          {dish.name}
        </h3>

        {/* Order Mode Controls - After Name */}
        {orderMode && (
          <div className="ml-2 sm:ml-3 shrink-0 flex items-center relative -top-[1px]">
            {quantity === 0 ? (
              <button
                onClick={handleAdd}
                className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-baoding-red hover:bg-red-800 flex items-center justify-center shadow-sm transition-all"
                title="添加"
              >
                <svg className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3.5} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            ) : (
              <div className="flex items-center space-x-0.5">
                <button
                  onClick={(e) => handleQuantityChange(e, -1)}
                  className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-gray-300 hover:bg-gray-400 flex items-center justify-center transition-all"
                >
                  <svg className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3.5} d="M20 12H4" />
                  </svg>
                </button>
                <span className="text-[9px] sm:text-[10px] font-bold text-baoding-dark min-w-[0.7rem] text-center">
                  {quantity}
                </span>
                <button
                  onClick={(e) => handleQuantityChange(e, 1)}
                  className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-baoding-red hover:bg-red-800 flex items-center justify-center shadow-sm transition-all"
                >
                  <svg className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3.5} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>
            )}
          </div>
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
        <p className="text-[9px] sm:text-[10px] text-stone-500 font-serif truncate flex-1">
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
