-- Día 3: juegos para los que cada usuario busca equipo
-- Ejecutar en Supabase: SQL Editor > New query > pegar todo > Run

create table public.juegos_buscando (
  id bigint generated always as identity primary key,
  perfil_id uuid not null default auth.uid() references public.perfiles (id) on delete cascade,
  rawg_id integer not null,
  nombre text not null,
  imagen text,
  creado_en timestamptz not null default now(),
  unique (perfil_id, rawg_id)
);

alter table public.juegos_buscando enable row level security;

-- Todos los usuarios con sesión pueden ver qué juegos busca cada quien (para hacer match)
create policy "Juegos visibles para usuarios con sesion"
  on public.juegos_buscando for select
  to authenticated
  using (true);

-- Cada quien solo agrega juegos a su propia lista
create policy "Cada usuario agrega a su lista"
  on public.juegos_buscando for insert
  to authenticated
  with check ((select auth.uid()) = perfil_id);

-- Cada quien solo quita juegos de su propia lista
create policy "Cada usuario quita de su lista"
  on public.juegos_buscando for delete
  to authenticated
  using ((select auth.uid()) = perfil_id);
