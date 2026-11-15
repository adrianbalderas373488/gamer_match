-- Día 2: tabla de perfiles
-- Ejecutar en Supabase: SQL Editor > New query > pegar todo > Run

create table public.perfiles (
  id uuid primary key references auth.users (id) on delete cascade,
  discord_id text,
  usuario text,
  avatar_url text,
  nivel text check (nivel in ('Principiante', 'Intermedio', 'Avanzado')),
  disponibilidad jsonb not null default '{"dias": [], "horarios": []}'::jsonb,
  steam_id text,
  creado_en timestamptz not null default now()
);

alter table public.perfiles enable row level security;

-- Cualquier usuario con sesión puede ver los perfiles (para encontrar compañeros)
create policy "Perfiles visibles para usuarios con sesion"
  on public.perfiles for select
  to authenticated
  using (true);

-- Cada quien solo puede editar su propio perfil
create policy "Cada usuario edita su perfil"
  on public.perfiles for update
  to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

-- Crear el perfil automáticamente con los datos de Discord al registrarse
create function public.crear_perfil_nuevo()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.perfiles (id, discord_id, usuario, avatar_url)
  values (
    new.id,
    new.raw_user_meta_data ->> 'provider_id',
    coalesce(
      new.raw_user_meta_data -> 'custom_claims' ->> 'global_name',
      new.raw_user_meta_data ->> 'full_name',
      new.raw_user_meta_data ->> 'name'
    ),
    new.raw_user_meta_data ->> 'avatar_url'
  );
  return new;
end;
$$;

create trigger al_crear_usuario
  after insert on auth.users
  for each row execute function public.crear_perfil_nuevo();
