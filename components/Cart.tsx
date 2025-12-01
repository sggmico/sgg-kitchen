import React from 'react';
import { MENU_ITEMS } from '../constants';

interface CartProps {
  cartItems: { [id: string]: number };
  onClear: () => void;
  onClose: () => void;
  isOpen: boolean;
}

const Cart: React.FC<CartProps> = ({ cartItems, onClear, onClose, isOpen }) => {
  const totalItems = Object.values(cartItems).reduce((sum: number, q: number) => sum + q, 0);
  
  if (!isOpen) return null;

  const getCartDetails = () => {
    return Object.entries(cartItems)
      .filter(([_, q]: [string, number]) => q > 0)
      .map(([id, quantity]: [string, number]) => {
        const dish = MENU_ITEMS.find(d => d.id === id);
        return { ...dish!, quantity };
      });
  };

  const items = getCartDetails();
  const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="fixed inset-0 z-40 flex flex-col justify-end sm:justify-center items-center pointer-events-none">
       {/* Backdrop */}
       <div className="absolute inset-0 bg-black/60 pointer-events-auto" onClick={onClose} />
       
       {/* Modal Content */}
       <div className="bg-white w-full sm:w-[400px] rounded-t-xl sm:rounded-xl pointer-events-auto overflow-hidden animate-slide-up shadow-2xl pb-6">
         {/* Header */}
         <div className="bg-stone-100 p-3 flex justify-between items-center border-b border-stone-200">
           <h3 className="font-bold text-gray-700">已选餐品 ({totalItems})</h3>
           <button 
             onClick={onClear}
             className="text-sm text-gray-500 flex items-center gap-1 hover:text-red-600"
           >
             <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
             清空
           </button>
         </div>

         {/* List */}
         <div className="max-h-[50vh] overflow-y-auto p-4 space-y-4">
           {items.length === 0 ? (
             <p className="text-center text-gray-400 py-8">购物车是空的，快去点个火烧吧！</p>
           ) : (
             items.map(item => (
               <div key={item.id} className="flex justify-between items-center">
                 <div className="flex flex-col">
                   <span className="font-medium text-gray-800">{item.name}</span>
                   <span className="text-xs text-gray-500">¥{item.price} / 份</span>
                 </div>
                 <div className="flex items-center gap-4">
                   <span className="text-gray-900 font-bold">¥{item.price * item.quantity}</span>
                   <span className="bg-stone-100 px-2 py-1 rounded text-sm font-medium text-gray-700">x {item.quantity}</span>
                 </div>
               </div>
             ))
           )}
         </div>

         {/* Footer Action */}
         <div className="p-4 border-t border-stone-100">
            <div className="flex justify-between items-center mb-4">
               <span className="text-lg font-bold text-gray-800">总计</span>
               <span className="text-2xl font-bold text-baoding-red">¥{totalPrice}</span>
            </div>
            <button 
              className="w-full bg-baoding-red text-white font-bold py-3 rounded-lg shadow-lg active:scale-[0.98] transition-transform disabled:opacity-50 disabled:grayscale"
              disabled={items.length === 0}
              onClick={() => alert(`客官您好！一共 ${totalPrice} 元。\n这就给您下单，请稍坐！`)}
            >
              立即下单
            </button>
         </div>
       </div>
    </div>
  );
};

export default Cart;