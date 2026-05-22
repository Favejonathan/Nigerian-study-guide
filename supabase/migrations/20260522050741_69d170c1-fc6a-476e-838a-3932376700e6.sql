
-- profiles
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now()
);
alter table public.profiles enable row level security;
create policy "own profile select" on public.profiles for select using (auth.uid() = id);
create policy "own profile insert" on public.profiles for insert with check (auth.uid() = id);
create policy "own profile update" on public.profiles for update using (auth.uid() = id);

-- auto profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email,'@',1)));
  return new;
end; $$;
create trigger on_auth_user_created
after insert on auth.users for each row execute function public.handle_new_user();

-- schedule_items
create table public.schedule_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  kind text not null check (kind in ('class','study')),
  title text not null,
  day_of_week smallint not null check (day_of_week between 0 and 6), -- 0=Sun
  start_time time not null,
  end_time time not null,
  created_at timestamptz not null default now()
);
alter table public.schedule_items enable row level security;
create policy "own items select" on public.schedule_items for select using (auth.uid() = user_id);
create policy "own items insert" on public.schedule_items for insert with check (auth.uid() = user_id);
create policy "own items update" on public.schedule_items for update using (auth.uid() = user_id);
create policy "own items delete" on public.schedule_items for delete using (auth.uid() = user_id);
create index schedule_items_user_day on public.schedule_items(user_id, day_of_week);
