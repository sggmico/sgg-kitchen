
import React, { useState, useEffect } from 'react';
import { MENU_ITEMS, DEFAULT_CATEGORIES } from './constants';
import { Dish, CategoryConfig, CartItem } from './types';
import DishCard from './components/DishCard';
import AdminPanel from './components/AdminPanel';
import CartSummary from './components/CartSummary';
import MobileCartBar from './components/MobileCartBar';
import OrderDetail from './components/OrderDetail';
import * as db from './lib/database';

type ViewMode = 'business' | 'family';
type PageMode = 'menu' | 'admin';

const MenuPage = ({
  categories,
  dishes,
  isFront,
  viewMode,
  orderMode,
  cart,
  onAddToCart,
  onUpdateQuantity
}: {
  categories: CategoryConfig[],
  dishes: Dish[],
  isFront: boolean,
  viewMode: ViewMode,
  orderMode?: boolean,
  cart?: CartItem[],
  onAddToCart?: (dish: Dish) => void,
  onUpdateQuantity?: (dishId: string, quantity: number) => void
}) => {
  // Grid Layout Logic
  // Business: 2 columns, wide gap
  // Family: 4 columns, narrower gap
  // Mobile: Always 2 columns for better readability
  const gridClass = viewMode === 'business'
    ? 'grid-cols-1 sm:grid-cols-2 gap-x-4 sm:gap-x-16 gap-y-3'
    : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-2 sm:gap-x-4 gap-y-3 sm:gap-y-4';

  const getDishesByCategory = (catName: string) => dishes.filter(d => d.category === catName);

  return (
    <div className="menu-page w-full sm:w-[210mm] min-h-[297mm] mx-auto bg-baoding-paper shadow-2xl relative flex flex-col p-4 sm:p-8 lg:p-12 print-break shrink-0">
      {/* Decorative Border */}
      <div className="absolute inset-2 sm:inset-4 border-2 sm:border-4 border-double border-baoding-red pointer-events-none z-10"></div>
      <div className="absolute inset-3 sm:inset-6 border border-baoding-red/30 pointer-events-none z-10"></div>

      {/* Corner Decors */}
      <div className="absolute top-2 sm:top-4 left-2 sm:left-4 w-8 sm:w-12 h-8 sm:h-12 border-t-2 sm:border-t-4 border-l-2 sm:border-l-4 border-baoding-red z-20"></div>
      <div className="absolute top-2 sm:top-4 right-2 sm:right-4 w-8 sm:w-12 h-8 sm:h-12 border-t-2 sm:border-t-4 border-r-2 sm:border-r-4 border-baoding-red z-20"></div>
      <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 w-8 sm:w-12 h-8 sm:h-12 border-b-2 sm:border-b-4 border-l-2 sm:border-l-4 border-baoding-red z-20"></div>
      <div className="absolute bottom-2 sm:bottom-4 right-2 sm:right-4 w-8 sm:w-12 h-8 sm:h-12 border-b-2 sm:border-b-4 border-r-2 sm:border-r-4 border-baoding-red z-20"></div>

      {/* Content Container */}
      <div className="relative z-30 h-full flex flex-col flex-1">
        
        {/* Header Area (Front Page Only - TOP) */}
        {isFront && (
          <div className="text-center pb-4 sm:pb-6 mb-4 sm:mb-8">
            <div className="mb-2">
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-serif font-black text-baoding-red mb-2 tracking-[0.05em] sm:tracking-[0.1em]">
                SGG · 私房菜
              </h1>
              <p className="text-baoding-dark/80 font-serif text-sm sm:text-lg lg:text-xl tracking-[0.2em] sm:tracking-[0.3em] uppercase">
                SGG Private Kitchen
              </p>
            </div>

            <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-4 lg:gap-6 text-xs sm:text-sm text-baoding-dark/60 font-serif mt-3 sm:mt-4">
               <span>匠心传承</span>
               <span className="w-1 h-1 bg-baoding-gold rounded-full"></span>
               <span>地道风味</span>
               {viewMode === 'family' && (
                 <>
                   <span className="w-1 h-1 bg-baoding-gold rounded-full"></span>
                   <span className="text-baoding-red font-bold">家宴专享</span>
                 </>
               )}
            </div>
          </div>
        )}
        
        {/* Categories List */}
        <div className="flex-1 space-y-4 sm:space-y-6 lg:space-y-8">
          {categories.map(cat => {
            const catDishes = getDishesByCategory(cat.name);
            if (catDishes.length === 0) return null;

            return (
              <section key={cat.id} className="mb-4 sm:mb-6">
                <div className="flex items-center justify-center mb-3 sm:mb-4 lg:mb-6">
                   <div className="h-[1px] bg-baoding-gold w-8 sm:w-12 lg:w-16"></div>
                   <div className="mx-2 sm:mx-3 lg:mx-4 flex flex-col items-center">
                      <h2 className="text-lg sm:text-xl lg:text-2xl font-serif font-bold text-baoding-red tracking-wide sm:tracking-wider lg:tracking-widest">{cat.name}</h2>
                   </div>
                   <div className="h-[1px] bg-baoding-gold w-8 sm:w-12 lg:w-16"></div>
                </div>

                {/* Dynamic Grid */}
                <div className={`grid ${gridClass} px-3 sm:px-4 lg:px-2`}>
                  {catDishes.map(dish => {
                    const cartItem = cart?.find(item => item.id === dish.id);
                    return (
                      <DishCard
                        key={dish.id}
                        dish={dish}
                        showPrice={viewMode === 'business'}
                        orderMode={orderMode}
                        quantity={cartItem?.quantity || 0}
                        onAddToCart={onAddToCart}
                        onUpdateQuantity={onUpdateQuantity}
                      />
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>

        {/* Footer (Back Page Only) */}
        {!isFront && (
          <footer className="mt-auto pt-4 sm:pt-6 lg:pt-8 pb-4 sm:pb-6 lg:pb-8 text-center text-baoding-dark/60 text-xs sm:text-sm font-serif shrink-0">
            <p className="mb-2">每一道菜都是岁月的味道</p>
            <div className="flex flex-wrap justify-center gap-2 sm:gap-4 text-xs sm:text-sm">
               <p>WIFI: SGG_Guest</p>
               <p className="hidden sm:inline">|</p>
               <p>预订电话: 0312-8888888</p>
            </div>
          </footer>
        )}
      </div>
    </div>
  );
};

function App() {
  const [isDownloading, setIsDownloading] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('family');
  const [pageMode, setPageMode] = useState<PageMode>('menu');
  const [orderMode, setOrderMode] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showOrderDetail, setShowOrderDetail] = useState(false);

  // Set default view mode to family on first load
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const mode = urlParams.get('mode');
    if (mode === 'business' || mode === 'family') {
      setViewMode(mode as ViewMode);
    }
  }, []);

  // Dynamic Data States
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [categories, setCategories] = useState<CategoryConfig[]>([]);

  // Load Initial Data from Supabase
  useEffect(() => {
    const loadData = async () => {
      try {
        const [dishesData, categoriesData] = await Promise.all([
          db.getDishes(),
          db.getCategories()
        ]);

        if (dishesData.length > 0) {
          setDishes(dishesData);
        } else {
          // Fallback to localStorage or default data
          const savedDishes = localStorage.getItem('sgg_menu_dishes');
          setDishes(savedDishes ? JSON.parse(savedDishes) : MENU_ITEMS);
        }

        if (categoriesData.length > 0) {
          setCategories(categoriesData);
        } else {
          // Fallback to localStorage or default data
          const savedCats = localStorage.getItem('sgg_menu_cats');
          setCategories(savedCats ? JSON.parse(savedCats) : DEFAULT_CATEGORIES);
        }
      } catch (error) {
        console.error('Failed to load data from Supabase:', error);
        // Fallback to localStorage
        const savedDishes = localStorage.getItem('sgg_menu_dishes');
        const savedCats = localStorage.getItem('sgg_menu_cats');
        setDishes(savedDishes ? JSON.parse(savedDishes) : MENU_ITEMS);
        setCategories(savedCats ? JSON.parse(savedCats) : DEFAULT_CATEGORIES);
      }
    };

    loadData();
  }, []);

  // Cart Management Functions
  const handleAddToCart = (dish: Dish) => {
    const existingItem = cart.find(item => item.id === dish.id);
    if (existingItem) {
      setCart(cart.map(item =>
        item.id === dish.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...dish, quantity: 1 }]);
    }
  };

  const handleUpdateQuantity = (dishId: string, quantity: number) => {
    if (quantity === 0) {
      setCart(cart.filter(item => item.id !== dishId));
    } else {
      setCart(cart.map(item =>
        item.id === dishId
          ? { ...item, quantity }
          : item
      ));
    }
  };

  const handleRemoveItem = (dishId: string) => {
    setCart(cart.filter(item => item.id !== dishId));
  };

  const handlePrint = () => {
    // 自动切换到非下单模式
    if (orderMode) {
      setOrderMode(false);
    }

    window.focus();
    setTimeout(() => {
        try {
            window.print();
        } catch (e) {
            console.error("Auto-print failed", e);
            alert("打印自动唤起失败，请使用键盘快捷键 Ctrl+P (或 Command+P) 进行打印。");
        }
    }, 100);
  };

  const handleDownloadPDF = async () => {
    const element = document.getElementById('menu-content');
    if (!element) return;
    
    setIsDownloading(true);

    try {
      const clone = element.cloneNode(true) as HTMLElement;
      
      // Reset formatting for PDF export
      clone.style.width = '210mm';
      clone.style.margin = '0 auto';
      clone.style.gap = '0';
      clone.style.alignItems = 'normal'; // Reset align-items
      
      const pages = clone.querySelectorAll('.menu-page');
      pages.forEach((p) => {
        (p as HTMLElement).style.boxShadow = 'none';
        (p as HTMLElement).style.marginBottom = '0';
        (p as HTMLElement).style.margin = '0';
      });

      clone.id = 'menu-content-clone';
      clone.style.position = 'absolute';
      clone.style.left = '-9999px';
      clone.style.top = '0';
      document.body.appendChild(clone);

      const filename = viewMode === 'business' ? 'SGG_私房菜_商业菜单.pdf' : 'SGG_私房菜_家宴菜单.pdf';

      const opt = {
        margin: 0,
        filename: filename,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, logging: false },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };

      // @ts-ignore
      await window.html2pdf().set(opt).from(clone).save();
      document.body.removeChild(clone);

    } catch (error) {
      console.error('PDF Generation failed', error);
      alert('PDF生成出错，建议使用“打印”按钮并选择“另存为PDF”。');
    } finally {
      setIsDownloading(false);
    }
  };

  const frontCategories = categories.filter(c => c.isFront);
  const backCategories = categories.filter(c => !c.isFront);

  return (
    <div className="min-h-screen py-2 sm:py-4 md:py-8 flex flex-col items-center bg-stone-800 overflow-x-hidden">
      
      {/* Simplified Control Bar */}
      <div className="no-print fixed top-0 left-0 right-0 bg-white shadow-sm z-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-3 md:px-6 py-2 md:py-2.5">
          <div className="flex items-center justify-between gap-2 md:gap-4">

            {/* Left: Brand & Mode Toggle */}
            <div className="flex items-center gap-2 md:gap-6">
              <h1 className="font-bold text-gray-800 text-sm md:text-lg whitespace-nowrap">SGG · 私房菜</h1>

              {/* Compact Mode Toggle */}
              <div className="flex items-center bg-gray-50 rounded-md p-0.5">
                <button
                  onClick={() => setViewMode('business')}
                  className={`px-2 md:px-3 py-1 rounded text-[11px] md:text-xs font-medium transition-all whitespace-nowrap ${
                    viewMode === 'business'
                    ? 'bg-white text-baoding-red shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  商业版
                </button>
                <button
                  onClick={() => setViewMode('family')}
                  className={`px-2 md:px-3 py-1 rounded text-[11px] md:text-xs font-medium transition-all whitespace-nowrap ${
                    viewMode === 'family'
                    ? 'bg-white text-baoding-red shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  家庭版
                </button>
              </div>
            </div>

            {/* Right: Action Buttons */}
            <div className="flex items-center gap-2">
              {/* Order Mode Toggle */}
              <button
                onClick={() => setOrderMode(!orderMode)}
                className={`${
                  orderMode
                    ? 'bg-baoding-red text-white'
                    : 'text-gray-500 hover:text-baoding-red'
                } transition-colors p-1.5 md:p-2 rounded relative`}
                title={orderMode ? "退出点菜" : "开始点菜"}
              >
                <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {cart.reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                )}
              </button>

              <button
                onClick={() => setPageMode('admin')}
                className="text-gray-500 hover:text-baoding-red transition-colors p-1.5 md:p-2"
                title="管理"
              >
                <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>

              <button
                onClick={handleDownloadPDF}
                disabled={isDownloading}
                className="text-gray-500 hover:text-gray-700 transition-colors p-1.5 md:p-2 disabled:opacity-50"
                title="下载PDF"
              >
                <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </button>

              <button
                onClick={handlePrint}
                className="bg-baoding-red hover:bg-red-900 text-white px-3 md:px-4 py-1.5 md:py-2 rounded-md transition-colors flex items-center gap-1.5 text-xs md:text-sm font-medium"
              >
                <svg className="w-3.5 h-3.5 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                <span className="hidden sm:inline">打印</span>
              </button>
            </div>

          </div>
        </div>
      </div>

      <div className="no-print h-[52px] md:h-[56px]"></div>

      {/* Preview Container with Responsive Layout */}
      {/* Mobile: Full width, Desktop: A4 size with optional cart sidebar */}
      <div className="flex w-full">
        {/* Main Menu Content */}
        <div
          id="print-container-wrapper"
          className={`w-full overflow-x-auto overflow-y-hidden pb-8 px-2 sm:px-4 flex justify-center items-start transition-all ${
            orderMode ? 'lg:mr-80' : ''
          }`}
        >
          <div id="menu-content" className="flex flex-col gap-4 sm:gap-6 lg:gap-8 items-center w-full sm:min-w-[210mm] sm:w-auto">
            {/* Page 1: Front */}
            <MenuPage
              isFront={true}
              categories={frontCategories}
              dishes={dishes}
              viewMode={viewMode}
              orderMode={orderMode}
              cart={cart}
              onAddToCart={handleAddToCart}
              onUpdateQuantity={handleUpdateQuantity}
            />

            {/* Page 2: Back */}
            <MenuPage
              isFront={false}
              categories={backCategories}
              dishes={dishes}
              viewMode={viewMode}
              orderMode={orderMode}
              cart={cart}
              onAddToCart={handleAddToCart}
              onUpdateQuantity={handleUpdateQuantity}
            />
          </div>
        </div>

        {/* Desktop Cart Sidebar */}
        {orderMode && (
          <div className="hidden lg:block fixed right-0 top-[56px] bottom-0 w-80 bg-white shadow-2xl border-l border-gray-200 z-40">
            <CartSummary
              items={cart}
              onUpdateQuantity={handleUpdateQuantity}
              onRemoveItem={handleRemoveItem}
              onViewOrder={() => setShowOrderDetail(true)}
            />
          </div>
        )}
      </div>

      {/* Mobile Cart Bar */}
      {orderMode && (
        <MobileCartBar
          items={cart}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveItem}
          onViewOrder={() => setShowOrderDetail(true)}
        />
      )}

      {/* Order Detail Modal */}
      {showOrderDetail && (
        <OrderDetail
          items={cart}
          onClose={() => setShowOrderDetail(false)}
          onPrint={() => {
            window.print();
            setShowOrderDetail(false);
          }}
        />
      )}

      {/* Admin Modal Overlay */}
      {pageMode === 'admin' && (
        <AdminPanel
          dishes={dishes}
          setDishes={setDishes}
          categories={categories}
          setCategories={setCategories}
          onClose={() => setPageMode('menu')}
        />
      )}

    </div>
  );
}

export default App;
