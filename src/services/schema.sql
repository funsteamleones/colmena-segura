-- ==============================================================================
-- COLMENA SEGURA - ESQUEMA DE BASE DE DATOS EN SUPABASE (POSTGRESQL + REALTIME)
-- ==============================================================================
-- Pega este script completo en el "SQL Editor" de tu proyecto de Supabase y dale a "Run".
-- Habilita sincronización instantánea padre <-> hijo en tiempo real sin recargar.

-- 1. Habilitar extensión UUID
create extension if not exists "uuid-ossp";

-- 2. Tabla de Familias (Cuentas parentales)
create table if not exists public.families (
  id text primary key,
  parent_name text not null,
  email text,
  pin text not null default '1234',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Tabla de Hijos
create table if not exists public.children (
  id text primary key,
  family_id text references public.families(id) on delete cascade,
  name text not null,
  age integer default 8,
  icon text default '🐝',
  coins integer default 100,
  screen_time_available integer default 30,
  screen_time_used_today integer default 0,
  recommended_screen_limit integer default 90,
  level integer default 1,
  streak_days integer default 1,
  completed_task_ids jsonb default '[]'::jsonb,
  pending_task_ids jsonb default '[]'::jsonb,
  screen_time_investments jsonb default '[]'::jsonb,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Tabla de Solicitudes de Validación de Misiones (Flujo Hijo -> Padre)
create table if not exists public.task_validation_requests (
  id text primary key,
  family_id text references public.families(id) on delete cascade,
  child_id text references public.children(id) on delete cascade,
  child_name text not null,
  child_icon text default '🐝',
  task_id integer not null,
  task_title text not null,
  task_coins integer not null,
  task_icon text default '⭐',
  task_category text default 'habitos',
  status text not null default 'pending', -- 'pending', 'approved', 'rejected'
  reason text,
  requested_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. Tabla de Misiones / Tareas
create table if not exists public.activities (
  id bigint primary key,
  family_id text references public.families(id) on delete cascade,
  title text not null,
  coins integer not null,
  icon text default '⭐',
  category text default 'habitos',
  time text default '20 min',
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. Tabla de Recompensas de la Tienda
create table if not exists public.rewards (
  id bigint primary key,
  family_id text references public.families(id) on delete cascade,
  title text not null,
  coins_cost integer not null,
  duration integer default 0, -- minutos de pantalla (0 si es recompensa real)
  icon text default '🎁',
  category text default 'pantalla',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 7. Habilitar Seguridad por Filas (Row Level Security) y Acceso Público con Anon Key
alter table public.families enable row level security;
alter table public.children enable row level security;
alter table public.task_validation_requests enable row level security;
alter table public.activities enable row level security;
alter table public.rewards enable row level security;

-- Políticas permisivas para la app familiar con Anon Key
create policy "Acceso público familias" on public.families for all using (true) with check (true);
create policy "Acceso público hijos" on public.children for all using (true) with check (true);
create policy "Acceso público validaciones" on public.task_validation_requests for all using (true) with check (true);
create policy "Acceso público misiones" on public.activities for all using (true) with check (true);
create policy "Acceso público recompensas" on public.rewards for all using (true) with check (true);

-- 8. Habilitar Realtime para suscripciones en vivo
alter publication supabase_realtime add table public.children;
alter publication supabase_realtime add table public.task_validation_requests;
alter publication supabase_realtime add table public.activities;
alter publication supabase_realtime add table public.rewards;
