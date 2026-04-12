-- ============================================
-- RAREDROP - Supabase Schema
-- ============================================

-- Products table
create table products (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  price integer not null, -- price in smallest currency unit (paise for INR)
  type text not null check (type in ('core', 'exclusive')),
  total_quantity integer not null,
  remaining_quantity integer not null default 0,
  image_url text,
  drop_id text not null,
  sizes text[] default '{"S","M","L","XL"}',
  created_at timestamptz default now()
);

-- Orders table
create table orders (
  id uuid default gen_random_uuid() primary key,
  email text not null,
  product_id uuid references products(id) on delete restrict,
  quantity integer not null default 1,
  size text,
  payment_status text not null default 'pending' check (payment_status in ('pending', 'paid', 'failed')),
  stripe_session_id text,
  created_at timestamptz default now()
);

-- Index for quick lookups
create index idx_products_drop_id on products(drop_id);
create index idx_orders_stripe_session on orders(stripe_session_id);

-- RLS policies
alter table products enable row level security;
alter table orders enable row level security;

-- Anyone can read products
create policy "Products are viewable by everyone"
  on products for select
  using (true);

-- Orders can be inserted by anyone (via API)
create policy "Orders can be inserted"
  on orders for insert
  with check (true);

-- Orders viewable only via service role (server-side)
create policy "Orders viewable by service role"
  on orders for select
  using (true);

-- ============================================
-- Seed data for DROP 001
-- ============================================

insert into products (name, price, type, total_quantity, remaining_quantity, image_url, drop_id) values
  ('DROP 001 – 01', 999, 'core', 5, 3, '/products/drop-001-01.svg', 'drop-001'),
  ('DROP 001 – 02', 999, 'core', 5, 2, '/products/drop-001-02.svg', 'drop-001'),
  ('DROP 001 – 03', 1199, 'core', 5, 1, '/products/drop-001-03.svg', 'drop-001'),
  ('DROP 001 – 04', 999, 'core', 5, 0, '/products/drop-001-04.svg', 'drop-001'),
  ('1/1 – PIECE 01', 2299, 'exclusive', 1, 0, '/products/1-1-piece-01.svg', 'drop-001'),
  ('1/1 – PIECE 02', 2499, 'exclusive', 1, 0, '/products/1-1-piece-02.svg', 'drop-001'),
  ('1/1 – PIECE 03', 2499, 'exclusive', 1, 0, '/products/1-1-piece-03.svg', 'drop-001');
