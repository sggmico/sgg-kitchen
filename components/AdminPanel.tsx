
import React, { useState } from 'react';
import { Dish, CategoryConfig } from '../types';

interface AdminPanelProps {
  dishes: Dish[];
  setDishes: (dishes: Dish[]) => void;
  categories: CategoryConfig[];
  setCategories: (cats: CategoryConfig[]) => void;
  onClose: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ 
  dishes, setDishes, 
  categories, setCategories, 
  onClose 
}) => {
  const [activeTab, setActiveTab] = useState<'dishes' | 'categories'>('dishes');
  const [editingDish, setEditingDish] = useState<Partial<Dish> | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // --- Dish Handlers ---
  const handleSaveDish = (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();

    if (!editingDish || !editingDish.name || !editingDish.category) {
      alert('请填写菜名和分类');
      return;
    }

    if (editingDish.id) {
      // Update
      setDishes(dishes.map(d => d.id === editingDish.id ? { ...d, ...editingDish } as Dish : d));
    } else {
      // Create
      const newDish: Dish = {
        ...editingDish,
        id: Date.now().toString(),
        name: editingDish.name,
        category: editingDish.category,
        price: Number(editingDish.price) || 0,
        imageUrl: editingDish.imageUrl || '',
        description: editingDish.description || '',
        spicyLevel: editingDish.spicyLevel || 0,
        popular: editingDish.popular || false
      } as Dish;
      setDishes([...dishes, newDish]);
    }
    setEditingDish(null);
  };

  const handleDeleteDish = (id: string) => {
    if (confirm('确定要删除这道菜吗？')) {
      setDishes(dishes.filter(d => d.id !== id));
    }
  };

  // --- Category Handlers ---
  const handleAddCategory = () => {
    const name = prompt('请输入新分类名称：');
    if (name) {
      setCategories([...categories, {
        id: `cat_${Date.now()}`,
        name,
        isFront: false
      }]);
    }
  };

  const handleDeleteCategory = (id: string) => {
    if (dishes.some(d => d.category === categories.find(c => c.id === id)?.name)) {
      alert('该分类下还有菜品，请先删除或移动菜品后再删除分类。');
      return;
    }
    if (confirm('确定删除此分类？')) {
      setCategories(categories.filter(c => c.id !== id));
    }
  };

  const toggleCategoryPage = (id: string) => {
    setCategories(categories.map(c => c.id === id ? { ...c, isFront: !c.isFront } : c));
  };
  
  const moveCategory = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === categories.length - 1) return;
    
    const newCats = [...categories];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newCats[index], newCats[targetIndex]] = [newCats[targetIndex], newCats[index]];
    setCategories(newCats);
  };

  const filteredDishes = dishes.filter(d => d.name.includes(searchQuery));

  return (
    <div className="fixed inset-0 z-[60] bg-gray-100 overflow-y-auto">
      {/* Simplified Admin Header */}
      <div className="bg-baoding-dark text-white sticky top-0 shadow-md z-10">
        <div className="max-w-7xl mx-auto px-3 md:px-6 py-2 md:py-2.5">
          <div className="flex items-center justify-between gap-3">

            {/* Left: Title & Tab Toggle */}
            <div className="flex items-center gap-3 md:gap-4">
              <h2 className="text-base md:text-lg font-bold whitespace-nowrap">后台管理</h2>

              {/* Tab Toggle */}
              <div className="flex bg-gray-700/50 rounded-md p-0.5">
                <button
                  onClick={() => setActiveTab('dishes')}
                  className={`px-3 md:px-4 py-1 rounded text-xs md:text-sm font-medium transition-all whitespace-nowrap ${
                    activeTab === 'dishes'
                    ? 'bg-white text-baoding-dark shadow-sm'
                    : 'text-gray-300 hover:text-white'
                  }`}
                >
                  菜品管理
                </button>
                <button
                  onClick={() => setActiveTab('categories')}
                  className={`px-3 md:px-4 py-1 rounded text-xs md:text-sm font-medium transition-all whitespace-nowrap ${
                    activeTab === 'categories'
                    ? 'bg-white text-baoding-dark shadow-sm'
                    : 'text-gray-300 hover:text-white'
                  }`}
                >
                  分类设置
                </button>
              </div>
            </div>

            {/* Right: Close Button */}
            <button
              onClick={onClose}
              className="text-gray-300 hover:text-white transition-colors p-1.5"
              title="退出后台"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="p-4 md:p-8 max-w-6xl mx-auto pb-20">
        
        {/* --- DISHES TAB --- */}
        {activeTab === 'dishes' && (
          <div className="bg-white rounded-lg shadow p-4 md:p-6">
            <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
              <input 
                type="text" 
                placeholder="搜索菜品..." 
                className="border p-2 rounded w-full md:w-64"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
              <button
                onClick={() => setEditingDish({ category: categories[0]?.name || '' })}
                className="bg-baoding-red text-white px-4 py-3 md:py-2 rounded hover:bg-red-800 font-bold shadow-sm"
              >
                + 新增菜品
              </button>
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b bg-gray-50 text-gray-600">
                    <th className="p-3">菜名</th>
                    <th className="p-3">价格</th>
                    <th className="p-3">分类</th>
                    <th className="p-3">属性</th>
                    <th className="p-3">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDishes.map(dish => (
                    <tr key={dish.id} className="border-b hover:bg-gray-50">
                      <td className="p-3 font-medium">{dish.name}</td>
                      <td className="p-3 text-red-600 font-bold">¥{dish.price}</td>
                      <td className="p-3 text-sm text-gray-500">{dish.category}</td>
                      <td className="p-3 text-xs">
                        {dish.popular && <span className="bg-red-100 text-red-800 px-1 rounded mr-1">招牌</span>}
                        {dish.spicyLevel && dish.spicyLevel > 0 ? <span className="text-orange-500">{'🌶️'.repeat(dish.spicyLevel)}</span> : null}
                      </td>
                      <td className="p-3 space-x-2">
                        <button onClick={() => setEditingDish(dish)} className="text-blue-600 hover:underline">编辑</button>
                        <button onClick={() => handleDeleteDish(dish.id)} className="text-red-600 hover:underline">删除</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
              {filteredDishes.map(dish => (
                <div key={dish.id} className="border rounded-lg p-4 shadow-sm flex flex-col gap-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-lg">{dish.name}</h3>
                      <p className="text-sm text-gray-500">{dish.category}</p>
                    </div>
                    <span className="text-red-600 font-bold text-lg">¥{dish.price}</span>
                  </div>
                  
                  <div className="flex gap-2 text-xs mb-2">
                     {dish.popular && <span className="bg-red-100 text-red-800 px-2 py-0.5 rounded">招牌</span>}
                     {dish.spicyLevel && dish.spicyLevel > 0 ? <span className="text-orange-600 bg-orange-50 px-2 py-0.5 rounded">{'🌶️'.repeat(dish.spicyLevel)}</span> : null}
                  </div>
                  
                  <div className="flex gap-2 mt-2 pt-2 border-t">
                    <button 
                      onClick={() => setEditingDish(dish)} 
                      className="flex-1 py-2 bg-blue-50 text-blue-600 rounded text-center font-medium"
                    >
                      编辑
                    </button>
                    <button 
                      onClick={() => handleDeleteDish(dish.id)} 
                      className="flex-1 py-2 bg-red-50 text-red-600 rounded text-center font-medium"
                    >
                      删除
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- CATEGORIES TAB --- */}
        {activeTab === 'categories' && (
          <div className="bg-white rounded-lg shadow p-4 md:p-6">
            <div className="flex justify-between mb-6 items-center">
              <h3 className="font-bold text-lg">分类配置</h3>
              <button 
                onClick={handleAddCategory} 
                className="bg-baoding-gold text-white px-4 py-2 rounded hover:opacity-90 shadow-sm text-sm md:text-base"
              >
                + 新增分类
              </button>
            </div>
            
            <div className="space-y-3">
              {categories.map((cat, idx) => (
                <div key={cat.id} className="flex flex-col md:flex-row md:items-center justify-between border p-3 rounded bg-gray-50 gap-3 md:gap-0">
                  <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="flex flex-col">
                      <button onClick={() => moveCategory(idx, 'up')} className="text-gray-400 hover:text-gray-800 px-2 py-1">▲</button>
                      <button onClick={() => moveCategory(idx, 'down')} className="text-gray-400 hover:text-gray-800 px-2 py-1">▼</button>
                    </div>
                    <input 
                      className="font-bold bg-transparent border-b border-transparent focus:border-blue-500 focus:outline-none flex-1"
                      value={cat.name}
                      onChange={(e) => setCategories(categories.map(c => c.id === cat.id ? { ...c, name: e.target.value } : c))}
                    />
                  </div>
                  
                  <div className="flex items-center gap-2 justify-end w-full md:w-auto">
                    <button 
                      onClick={() => toggleCategoryPage(cat.id)}
                      className={`px-3 py-1.5 rounded text-xs md:text-sm font-medium ${cat.isFront ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}
                    >
                      {cat.isFront ? '正面' : '背面'}
                    </button>
                    <button onClick={() => handleDeleteCategory(cat.id)} className="text-red-500 hover:text-red-700 bg-red-50 px-3 py-1.5 rounded text-xs md:text-sm">删除</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- EDIT MODAL --- */}
        {editingDish && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[70] p-4">
            <div className="bg-white rounded-xl p-4 md:p-6 w-full max-w-lg shadow-2xl flex flex-col max-h-[90vh] overflow-y-auto">
              <h3 className="font-bold text-xl mb-4 text-center md:text-left">{editingDish.id ? '编辑菜品' : '新增菜品'}</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">菜名</label>
                  <input 
                    className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-baoding-red focus:outline-none" 
                    value={editingDish.name || ''} 
                    onChange={e => setEditingDish({...editingDish, name: e.target.value})}
                  />
                </div>
                
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-bold text-gray-700 mb-1">价格</label>
                    <input 
                      type="number"
                      className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-baoding-red focus:outline-none" 
                      value={editingDish.price || ''} 
                      onChange={e => setEditingDish({...editingDish, price: Number(e.target.value)})}
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-bold text-gray-700 mb-1">分类</label>
                    <select 
                      className="w-full border p-3 rounded-lg bg-white"
                      value={editingDish.category || categories[0]?.name || ''}
                      onChange={e => setEditingDish({...editingDish, category: e.target.value})}
                    >
                      {categories.map(c => (
                        <option key={c.id} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                   <label className="block text-sm font-bold text-gray-700 mb-1">描述</label>
                   <textarea 
                     className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-baoding-red focus:outline-none"
                     rows={3}
                     value={editingDish.description || ''}
                     onChange={e => setEditingDish({...editingDish, description: e.target.value})}
                   />
                </div>

                <div className="bg-gray-50 p-3 rounded-lg flex flex-col gap-3">
                   <label className="flex items-center gap-2 cursor-pointer p-2 hover:bg-gray-100 rounded">
                     <input 
                       type="checkbox" 
                       className="w-5 h-5 text-baoding-red rounded focus:ring-baoding-red"
                       checked={editingDish.popular || false}
                       onChange={e => setEditingDish({...editingDish, popular: e.target.checked})}
                     />
                     <span className="font-medium">🔥 设为招牌</span>
                   </label>
                   
                   <div className="flex items-center gap-2 p-2">
                     <span className="text-sm font-medium">辣度:</span>
                     <div className="flex gap-2">
                       {[0,1,2,3].map(lvl => (
                         <button 
                           key={lvl}
                           onClick={() => setEditingDish({...editingDish, spicyLevel: lvl as any})}
                           className={`w-8 h-8 rounded-full flex items-center justify-center text-sm border transition-colors ${editingDish.spicyLevel === lvl ? 'bg-red-500 text-white border-red-500 shadow-md' : 'bg-white text-gray-500 border-gray-300'}`}
                         >
                           {lvl}
                         </button>
                       ))}
                     </div>
                   </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setEditingDish(null)}
                  className="flex-1 py-3 text-gray-600 bg-gray-100 rounded-lg font-medium"
                >
                  取消
                </button>
                <button
                  type="button"
                  onClick={(e) => handleSaveDish(e)}
                  className="flex-1 py-3 bg-baoding-red text-white rounded-lg font-bold shadow-md hover:bg-red-800 transition-colors"
                >
                  保存
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
