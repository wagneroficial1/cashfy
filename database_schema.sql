-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. PROFILES (Linked to auth.users)
create table public.profiles (
  id uuid references auth.users not null primary key,
  email text,
  full_name text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.profiles enable row level security;

create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = id);

create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

-- Function to handle new user signup
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (new.id, new.email, new.raw_user_meta_data->>'name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger for new user signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- 2. PROJECTS (Future-proofing for Plans)
create table public.projects (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) not null,
  name text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.projects enable row level security;

create policy "Users can CRUD own projects" on public.projects
  for all using (auth.uid() = user_id); 


-- 3. TRANSACTIONS (Receitas e Despesas)
create table public.transactions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) not null,
  project_id uuid references public.projects(id), -- Optional now, useful later
  description text not null,
  amount numeric not null,
  category text not null,
  type text check (type in ('income', 'expense', 'investment')) not null,
  date date not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.transactions enable row level security;

create policy "Users can CRUD own transactions" on public.transactions
  for all using (auth.uid() = user_id);


-- 4. GOALS (Metas Financeiras)
create table public.goals (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) not null,
  name text not null,
  target_amount numeric not null,
  current_amount numeric default 0,
  deadline date,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.goals enable row level security;

create policy "Users can CRUD own goals" on public.goals
  for all using (auth.uid() = user_id);
