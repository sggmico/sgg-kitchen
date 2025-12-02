import React from 'react';
import type { CartItem } from '../types';

interface CartSummaryProps {
  items: CartItem[];
  onUpdateQuantity: (dishId: string, quantity: number) => void;
  onRemoveItem: (dishId: string) => void;
  onViewOrder: () => void;
  className?: string;
}

const CartSummary: React.FC<CartSummaryProps> = ({
  items,
  onUpdateQuantity,
  onRemoveItem,
  onViewOrder,
  className = '',
}) => {
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  if (items.length === 0) {
    return (
      <div className={`${className}`}>
        <div className="text-center py-8 text-gray-400">
          <svg className="w-16 h-16 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <p className="text-sm">还没有选择菜品</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${className} flex flex-col h-full`}>
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 bg-baoding-paper">
        <h3 className="font-serif text-lg font-bold text-baoding-dark flex items-center justify-between">
          <span>已选菜品</span>
          <span className="text-sm font-normal text-gray-600">
            {totalItems} 道菜
          </span>
        </h3>
      </div>

      {/* Cart Items */}
      <div className="flex-1 overflow-y-auto px-4 py-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="mb-3 pb-3 border-b border-gray-100 last:border-0"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <div className="flex items-baseline">
                  <h4 className="font-serif font-semibold text-baoding-dark text-sm">
                    {item.name}
                  </h4>
                  {item.popular && (
                    <span className="ml-2 text-xs bg-baoding-red text-white px-1.5 py-0.5 rounded">
                      招牌
                    </span>
                  )}
                </div>
                <p className="text-xs text-baoding-red font-medium mt-1">
                  ¥{item.price}
                </p>
              </div>
              <button
                onClick={() => onRemoveItem(item.id)}
                className="ml-2 text-gray-400 hover:text-red-500 transition-colors"
                title="移除"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Quantity Controls */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              </button>
              <span className="text-sm font-medium min-w-[2rem] text-center">
                {item.quantity}
              </span>
              <button
                onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
              <span className="text-xs text-gray-500 ml-2">
                ¥{(item.price * item.quantity).toFixed(2)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Footer with Total and Action Button */}
      <div className="border-t border-gray-200 p-4 bg-white">
        <div className="flex items-center justify-between mb-3">
          <span className="font-serif text-base font-semibold text-baoding-dark">
            合计
          </span>
          <span className="text-xl font-bold text-baoding-red">
            ¥{totalPrice.toFixed(2)}
          </span>
        </div>
        <button
          onClick={onViewOrder}
          className="w-full bg-baoding-red text-white py-3 rounded-lg font-medium hover:bg-red-800 transition-colors shadow-lg"
        >
          查看订单详情
        </button>
      </div>
    </div>
  );
};

export default CartSummary;
