-- Orders Tables Migration
-- This migration creates tables for storing customer orders

-- Orders Table (主订单表)
create table if not exists orders (
  id uuid primary key default uuid_generate_v4(),
  order_number text not null unique, -- 订单号，格式如 ORD-20250102-0001
  total_amount numeric(10,2) not null default 0, -- 订单总金额
  total_items integer not null default 0, -- 菜品总数量
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'preparing', 'completed', 'cancelled')), -- 订单状态
  customer_name text default '', -- 客户名称（可选）
  customer_phone text default '', -- 客户电话（可选）
  table_number text default '', -- 桌号（可选）
  notes text default '', -- 订单备注
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Order Items Table (订单明细表)
create table if not exists order_items (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid not null references orders(id) on delete cascade, -- 关联订单ID
  dish_id uuid references dishes(id) on delete set null, -- 关联菜品ID（可为空，防止菜品删除时订单记录丢失）
  dish_name text not null, -- 菜品名称（快照，防止菜品信息变更）
  dish_category text not null, -- 菜品分类（快照）
  dish_price numeric(10,2) not null, -- 菜品单价（快照）
  quantity integer not null default 1 check (quantity > 0), -- 数量
  subtotal numeric(10,2) not null, -- 小计（price * quantity）
  is_popular boolean default false, -- 是否招牌菜（快照）
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create indexes for better query performance
create index if not exists orders_order_number_idx on orders(order_number);
create index if not exists orders_status_idx on orders(status);
create index if not exists orders_created_at_idx on orders(created_at desc);
create index if not exists order_items_order_id_idx on order_items(order_id);
create index if not exists order_items_dish_id_idx on order_items(dish_id);

-- Enable Row Level Security (RLS)
alter table orders enable row level security;
alter table order_items enable row level security;

-- Public insert access for orders (anyone can create order)
create policy "Enable insert for all users" on orders
  for insert with check (true);

-- Public read access for orders
create policy "Enable read access for all users" on orders
  for select using (true);

-- Authenticated users can update/delete orders
create policy "Enable update for authenticated users only" on orders
  for update using (auth.role() = 'authenticated');

create policy "Enable delete for authenticated users only" on orders
  for delete using (auth.role() = 'authenticated');

-- Public insert access for order_items (anyone can create order items)
create policy "Enable insert for all users" on order_items
  for insert with check (true);

-- Public read access for order_items
create policy "Enable read access for all users" on order_items
  for select using (true);

-- Authenticated users can update/delete order_items
create policy "Enable update for authenticated users only" on order_items
  for update using (auth.role() = 'authenticated');

create policy "Enable delete for authenticated users only" on order_items
  for delete using (auth.role() = 'authenticated');

-- Trigger for updating orders updated_at
create trigger update_orders_updated_at before update on orders
  for each row execute function update_updated_at_column();

-- Function to generate order number
create or replace function generate_order_number()
returns text as $$
declare
  date_part text;
  seq_part text;
  max_num integer;
begin
  date_part := to_char(now(), 'YYYYMMDD');

  -- Get max sequence number for today
  select coalesce(max(substring(order_number from 'ORD-\d{8}-(\d{4})')::integer), 0)
  into max_num
  from orders
  where order_number like 'ORD-' || date_part || '-%';

  seq_part := lpad((max_num + 1)::text, 4, '0');

  return 'ORD-' || date_part || '-' || seq_part;
end;
$$ language plpgsql;
