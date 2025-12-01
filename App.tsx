
import React, { useState, useEffect } from 'react';
import { MENU_ITEMS, DEFAULT_CATEGORIES } from './constants';
import { Dish, CategoryConfig } from './types';
import DishCard from './components/DishCard';
import AdminPanel from './components/AdminPanel';

type ViewMode = 'business' | 'family';
type PageMode = 'menu' | 'admin';

const MenuPage = ({ 
  categories, 
  dishes,
  isFront, 
  viewMode 
}: { 
  categories: CategoryConfig[], 
  dishes: Dish[],
  isFront: boolean,
  viewMode: ViewMode
}) => {
  // Grid Layout Logic
  // Business: 2 columns, wide gap
  // Family: 4 columns, narrower gap
  const gridClass = viewMode === 'business' 
    ? 'grid-cols-2 gap-x-16 gap-y-3' 
    : 'grid-cols-4 gap-x-4 gap-y-4';

  const getDishesByCategory = (catName: string) => dishes.filter(d => d.category === catName);

  return (
    <div className="menu-page w-[210mm] min-h-[297mm] mx-auto bg-baoding-paper shadow-2xl relative flex flex-col p-12 print-break shrink-0">
      {/* Decorative Border */}
      <div className="absolute inset-4 border-4 border-double border-baoding-red pointer-events-none z-10"></div>
      <div className="absolute inset-6 border border-baoding-red/30 pointer-events-none z-10"></div>
      
      {/* Corner Decors */}
      <div className="absolute top-4 left-4 w-12 h-12 border-t-4 border-l-4 border-baoding-red z-20"></div>
      <div className="absolute top-4 right-4 w-12 h-12 border-t-4 border-r-4 border-baoding-red z-20"></div>
      <div className="absolute bottom-4 left-4 w-12 h-12 border-b-4 border-l-4 border-baoding-red z-20"></div>
      <div className="absolute bottom-4 right-4 w-12 h-12 border-b-4 border-r-4 border-baoding-red z-20"></div>

      {/* Content Container */}
      <div className="relative z-30 h-full flex flex-col flex-1">
        
        {/* Header Area (Front Page Only - TOP) */}
        {isFront && (
          <div className="text-center pb-6 mb-8">
            <div className="mb-2">
              <h1 className="text-7xl font-serif font-black text-baoding-red mb-2 tracking-[0.1em]">
                SGG · 私房菜
              </h1>
              <p className="text-baoding-dark/80 font-serif text-xl tracking-[0.3em] uppercase">
                SGG Private Kitchen
              </p>
            </div>
            
            <div className="flex justify-center items-center gap-6 text-xs text-baoding-dark/60 font-serif mt-4">
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
        <div className="flex-1 space-y-8">
          {categories.map(cat => {
            const catDishes = getDishesByCategory(cat.name);
            if (catDishes.length === 0) return null;

            return (
              <section key={cat.id} className="mb-6">
                <div className="flex items-center justify-center mb-6">
                   <div className="h-[1px] bg-baoding-gold w-16"></div>
                   <div className="mx-4 flex flex-col items-center">
                      <h2 className="text-2xl font-serif font-bold text-baoding-red tracking-widest">{cat.name}</h2>
                   </div>
                   <div className="h-[1px] bg-baoding-gold w-16"></div>
                </div>
                
                {/* Dynamic Grid */}
                <div className={`grid ${gridClass} px-2`}>
                  {catDishes.map(dish => (
                    <DishCard 
                      key={dish.id} 
                      dish={dish} 
                      showPrice={viewMode === 'business'} 
                    />
                  ))}
                </div>
              </section>
            );
          })}
        </div>

        {/* Footer (Back Page Only) */}
        {!isFront && (
          <footer className="mt-auto pt-8 text-center text-baoding-dark/60 text-xs font-serif shrink-0">
            <p className="mb-2">每一道菜都是岁月的味道</p>
            <div className="flex justify-center gap-4">
               <p>WIFI: SGG_Guest</p>
               <p>|</p>
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
  const [viewMode, setViewMode] = useState<ViewMode>('business');
  const [pageMode, setPageMode] = useState<PageMode>('menu');

  // Dynamic Data States
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [categories, setCategories] = useState<CategoryConfig[]>([]);

  // Load Initial Data
  useEffect(() => {
    const savedDishes = localStorage.getItem('sgg_menu_dishes');
    const savedCats = localStorage.getItem('sgg_menu_cats');

    if (savedDishes) {
      setDishes(JSON.parse(savedDishes));
    } else {
      setDishes(MENU_ITEMS);
    }

    if (savedCats) {
      setCategories(JSON.parse(savedCats));
    } else {
      setCategories(DEFAULT_CATEGORIES);
    }
  }, []);

  // Save Data Changes
  useEffect(() => {
    if (dishes.length > 0) localStorage.setItem('sgg_menu_dishes', JSON.stringify(dishes));
  }, [dishes]);

  useEffect(() => {
    if (categories.length > 0) localStorage.setItem('sgg_menu_cats', JSON.stringify(categories));
  }, [categories]);


  const handlePrint = () => {
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
    <div className="min-h-screen py-4 md:py-8 flex flex-col items-center bg-stone-800 overflow-x-hidden">
      
      {/* Responsive Control Bar */}
      <div className="no-print fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md shadow-md p-3 md:p-4 flex flex-col md:flex-row justify-between items-center z-50 border-b border-stone-200 gap-3 md:gap-0">
        
        <div className="flex flex-col md:flex-row items-center gap-3 md:gap-6 w-full md:w-auto">
          <div className="flex items-center gap-2">
            <h1 className="font-bold text-gray-800 text-lg leading-tight whitespace-nowrap">SGG · 私房菜</h1>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">预览</span>
          </div>
          
          {/* Mode Toggles */}
          <div className="flex bg-stone-100 p-1 rounded-lg w-full md:w-auto justify-center">
             <button 
               onClick={() => setViewMode('business')}
               className={`flex-1 md:flex-none px-3 py-1.5 rounded-md text-xs md:text-sm font-bold transition-all whitespace-nowrap ${
                 viewMode === 'business' 
                 ? 'bg-white text-baoding-red shadow-sm' 
                 : 'text-gray-500 hover:text-gray-700'
               }`}
             >
               商业版
             </button>
             <button 
               onClick={() => setViewMode('family')}
               className={`flex-1 md:flex-none px-3 py-1.5 rounded-md text-xs md:text-sm font-bold transition-all whitespace-nowrap ${
                 viewMode === 'family' 
                 ? 'bg-white text-baoding-red shadow-sm' 
                 : 'text-gray-500 hover:text-gray-700'
               }`}
             >
               家庭版
             </button>
          </div>
        </div>

        <div className="flex gap-2 w-full md:w-auto justify-center overflow-x-auto pb-1 md:pb-0 px-1 md:px-0">
          <button 
             onClick={() => setPageMode('admin')}
             className="text-gray-600 hover:text-baoding-red font-bold text-xs md:text-sm px-3 py-2 bg-gray-50 rounded-lg whitespace-nowrap border border-gray-200 md:bg-transparent md:border-none"
          >
            ⚙️ 管理
          </button>
          <div className="hidden md:block w-[1px] bg-gray-300 h-6 self-center"></div>
          <button 
            onClick={handleDownloadPDF}
            disabled={isDownloading}
            className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-3 py-2 rounded-lg shadow-sm font-bold flex items-center gap-2 transition-colors disabled:opacity-50 text-xs md:text-sm whitespace-nowrap"
          >
            {isDownloading ? '...' : 'PDF'}
          </button>

          <button 
            onClick={handlePrint}
            className="bg-baoding-red hover:bg-red-900 text-white px-4 py-2 rounded-lg shadow-lg font-bold flex items-center gap-2 transition-colors text-xs md:text-sm whitespace-nowrap"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            打印
          </button>
        </div>
      </div>

      <div className="no-print h-[120px] md:h-16"></div>

      {/* Preview Container with Horizontal Scroll for Mobile */}
      {/* Added ID for Print CSS Targeting */}
      <div id="print-container-wrapper" className="w-full overflow-x-auto overflow-y-hidden pb-8 px-4 flex justify-center items-start">
        <div id="menu-content" className="flex flex-col gap-8 items-center min-w-[210mm]">
          {/* Page 1: Front */}
          <MenuPage 
            isFront={true} 
            categories={frontCategories} 
            dishes={dishes}
            viewMode={viewMode}
          />

          {/* Page 2: Back */}
          <MenuPage 
            isFront={false} 
            categories={backCategories} 
            dishes={dishes}
            viewMode={viewMode}
          />
        </div>
      </div>

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
