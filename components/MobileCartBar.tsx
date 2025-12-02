import React, { useState } from 'react';
import type { CartItem } from '../types';
import CartSummary from './CartSummary';

interface MobileCartBarProps {
  items: CartItem[];
  onUpdateQuantity: (dishId: string, quantity: number) => void;
  onRemoveItem: (dishId: string) => void;
  onViewOrder: () => void;
}

const MobileCartBar: React.FC<MobileCartBarProps> = ({
  items,
  onUpdateQuantity,
  onRemoveItem,
  onViewOrder,
}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  if (items.length === 0) {
    return null;
  }

  return (
    <>
      {/* Mobile Bottom Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t-2 border-baoding-gold shadow-lg z-50">
        <button
          onClick={() => setIsDrawerOpen(true)}
          className="w-full px-4 py-3 flex items-center justify-between"
        >
          <div className="flex items-center space-x-3">
            <div className="relative">
              <svg className="w-6 h-6 text-baoding-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-baoding-red text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </div>
            <div className="text-left">
              <p className="text-xs text-gray-600">已选 {totalItems} 道菜</p>
              <p className="text-base font-bold text-baoding-red">¥{totalPrice.toFixed(2)}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-baoding-dark">查看订单</span>
            <svg className="w-4 h-4 text-baoding-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </button>
      </div>

      {/* Drawer Overlay */}
      {isDrawerOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-[60] transition-opacity"
          onClick={() => setIsDrawerOpen(false)}
        >
          {/* Drawer */}
          <div
            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl max-h-[80vh] flex flex-col animate-slide-up overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Handle */}
            <div className="flex justify-center pt-3 pb-2 shrink-0">
              <div className="w-12 h-1.5 bg-gray-300 rounded-full"></div>
            </div>

            {/* Cart Summary */}
            <CartSummary
              items={items}
              onUpdateQuantity={onUpdateQuantity}
              onRemoveItem={onRemoveItem}
              onViewOrder={() => {
                setIsDrawerOpen(false);
                onViewOrder();
              }}
              className="flex-1 min-h-0"
            />
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default MobileCartBar;
