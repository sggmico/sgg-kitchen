import { supabase } from './supabase';
import type { Dish, CategoryConfig } from '../types';

// Helper to ensure supabase is configured
function ensureSupabase() {
  if (!supabase) {
    throw new Error('Supabase is not configured');
  }
  return supabase;
}

// Categories
export async function getCategories(): Promise<CategoryConfig[]> {
  const client = ensureSupabase();

  const { data, error } = await client
    .from('categories')
    .select('*')
    .order('display_order', { ascending: true });

  if (error) throw error;

  return (data || []).map((cat) => ({
    id: cat.id,
    name: cat.name,
    isFront: cat.is_front,
  }));
}

export async function createCategory(category: Omit<CategoryConfig, 'id'>): Promise<CategoryConfig> {
  const { data, error } = await ensureSupabase()
    .from('categories')
    .insert({
      name: category.name,
      is_front: category.isFront,
      display_order: 0,
    })
    .select()
    .single();

  if (error) throw error;

  return {
    id: data.id,
    name: data.name,
    isFront: data.is_front,
  };
}

export async function updateCategory(id: string, updates: Partial<CategoryConfig>): Promise<void> {
  const updateData: any = {};
  if (updates.name !== undefined) updateData.name = updates.name;
  if (updates.isFront !== undefined) updateData.is_front = updates.isFront;

  const { error } = await ensureSupabase()
    .from('categories')
    .update(updateData)
    .eq('id', id);

  if (error) throw error;
}

export async function deleteCategory(id: string): Promise<void> {
  const { error } = await ensureSupabase()
    .from('categories')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function reorderCategories(categories: CategoryConfig[]): Promise<void> {
  const updates = categories.map((cat, index) => ({
    id: cat.id,
    display_order: index,
  }));

  for (const update of updates) {
    await ensureSupabase()
      .from('categories')
      .update({ display_order: update.display_order })
      .eq('id', update.id);
  }
}

// Dishes
export async function getDishes(): Promise<Dish[]> {
  const { data, error } = await ensureSupabase()
    .from('dishes')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) throw error;

  return (data || []).map((dish) => ({
    id: dish.id,
    name: dish.name,
    category: dish.category,
    price: Number(dish.price),
    description: dish.description || '',
    imageUrl: dish.image_url || '',
    spicyLevel: dish.spicy_level || 0,
    popular: dish.popular || false,
  }));
}

export async function createDish(dish: Omit<Dish, 'id'>): Promise<Dish> {
  const { data, error } = await ensureSupabase()
    .from('dishes')
    .insert({
      name: dish.name,
      category: dish.category,
      price: dish.price,
      description: dish.description,
      image_url: dish.imageUrl,
      spicy_level: dish.spicyLevel,
      popular: dish.popular,
    })
    .select()
    .single();

  if (error) throw error;

  return {
    id: data.id,
    name: data.name,
    category: data.category,
    price: Number(data.price),
    description: data.description || '',
    imageUrl: data.image_url || '',
    spicyLevel: data.spicy_level || 0,
    popular: data.popular || false,
  };
}

export async function updateDish(id: string, updates: Partial<Dish>): Promise<void> {
  const updateData: any = {};
  if (updates.name !== undefined) updateData.name = updates.name;
  if (updates.category !== undefined) updateData.category = updates.category;
  if (updates.price !== undefined) updateData.price = updates.price;
  if (updates.description !== undefined) updateData.description = updates.description;
  if (updates.imageUrl !== undefined) updateData.image_url = updates.imageUrl;
  if (updates.spicyLevel !== undefined) updateData.spicy_level = updates.spicyLevel;
  if (updates.popular !== undefined) updateData.popular = updates.popular;

  const { error } = await ensureSupabase()
    .from('dishes')
    .update(updateData)
    .eq('id', id);

  if (error) throw error;
}

export async function deleteDish(id: string): Promise<void> {
  const { error } = await ensureSupabase()
    .from('dishes')
    .delete()
    .eq('id', id);

  if (error) throw error;
}
