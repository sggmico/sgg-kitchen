import React, { useState } from 'react';
import type { CartItem } from '../types';
import { createOrder } from '../lib/orders';

interface OrderDetailProps {
  items: CartItem[];
  onClose: () => void;
  onOrderSaved?: () => void;
}

const OrderDetail: React.FC<OrderDetailProps> = ({ items, onClose, onOrderSaved }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [savedOrderNumber, setSavedOrderNumber] = useState<string | null>(null);
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  // Group items by category
  const groupedItems = items.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, CartItem[]>);

  const currentDate = new Date().toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });

  const handleConfirmOrder = async () => {
    setIsSaving(true);
    setSaveError(null);

    try {
      const result = await createOrder({
        items,
      });

      if (result) {
        setSavedOrderNumber(result.order.orderNumber);
        // Call callback if provided
        if (onOrderSaved) {
          onOrderSaved();
        }
      } else {
        setSaveError('保存订单失败，请重试');
      }
    } catch (error) {
      console.error('Error saving order:', error);
      setSaveError('保存订单失败，请重试');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900/50 z-[70] flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-baoding-red text-white px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-serif font-bold">订单详情</h2>
            <p className="text-sm text-white/80 mt-1">{currentDate}</p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Order Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4" id="order-print-area">
          {/* Restaurant Header for Print */}
          <div className="text-center mb-6 print:block hidden">
            <h1 className="text-2xl font-serif font-bold text-baoding-dark">SGG · 私房菜</h1>
            <p className="text-sm text-gray-600 mt-1">订单时间: {currentDate}</p>
          </div>

          {/* Order Summary Stats */}
          <div className="bg-baoding-paper border border-baoding-gold/30 rounded-lg p-4 mb-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">菜品数量</p>
                <p className="text-2xl font-bold text-baoding-dark">{totalItems}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">订单金额</p>
                <p className="text-2xl font-bold text-baoding-red">¥{totalPrice.toFixed(2)}</p>
              </div>
            </div>
          </div>

          {/* Ordered Items by Category */}
          <div className="space-y-6">
            {Object.entries(groupedItems).map(([category, categoryItems]) => (
              <div key={category} className="border-b border-gray-200 pb-4 last:border-0">
                <h3 className="font-serif font-bold text-baoding-dark mb-3 text-lg flex items-center">
                  <span className="w-1 h-6 bg-baoding-red mr-2 rounded"></span>
                  {category}
                </h3>
                <div className="space-y-3">
                  {categoryItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-start justify-between py-2 hover:bg-gray-50 rounded px-2 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-baseline">
                          <h4 className="font-serif font-semibold text-baoding-dark">
                            {item.name}
                          </h4>
                          {item.popular && (
                            <span className="ml-2 text-xs bg-baoding-red text-white px-1.5 py-0.5 rounded">
                              招牌
                            </span>
                          )}
                        </div>
                        {item.description && (
                          <p className="text-sm text-gray-500 mt-0.5">{item.description}</p>
                        )}
                        <div className="flex items-center mt-1 text-sm text-gray-600">
                          <span>¥{item.price}</span>
                          <span className="mx-2">×</span>
                          <span>{item.quantity}</span>
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <p className="font-semibold text-baoding-red">
                          ¥{(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Total Section */}
          <div className="mt-6 pt-4 border-t-2 border-baoding-gold">
            <div className="flex justify-between items-center text-lg">
              <span className="font-serif font-bold text-baoding-dark">合计</span>
              <span className="text-2xl font-bold text-baoding-red">
                ¥{totalPrice.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="border-t border-gray-200 px-6 py-4">
          {/* Success Message */}
          {savedOrderNumber && (
            <div className="mb-3 bg-green-50 border border-green-200 rounded-lg p-3 flex items-center">
              <svg className="w-5 h-5 text-green-600 mr-2 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="flex-1">
                <p className="text-sm font-medium text-green-800">订单已保存成功！</p>
                <p className="text-xs text-green-600 mt-0.5">订单号：{savedOrderNumber}</p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {saveError && (
            <div className="mb-3 bg-red-50 border border-red-200 rounded-lg p-3 flex items-center">
              <svg className="w-5 h-5 text-red-600 mr-2 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm text-red-800">{saveError}</p>
            </div>
          )}

          {/* Action Button */}
          {!savedOrderNumber ? (
            <button
              onClick={handleConfirmOrder}
              disabled={isSaving}
              className="w-full bg-baoding-red text-white py-3 rounded-lg font-medium hover:bg-red-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isSaving ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>保存中...</span>
                </>
              ) : (
                <span>确认订单</span>
              )}
            </button>
          ) : (
            <button
              onClick={onClose}
              className="w-full bg-baoding-red text-white py-3 rounded-lg font-medium hover:bg-red-800 transition-colors"
            >
              完成
            </button>
          )}
        </div>
      </div>

      {/* Print Styles */}
      <style jsx>{`
        @media print {
          .fixed {
            position: static;
          }
          #order-print-area {
            max-height: none;
          }
        }
      `}</style>
    </div>
  );
};

export default OrderDetail;
