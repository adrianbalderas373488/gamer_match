-- Día 7: solicitudes de equipo y matches (una solicitud aceptada es un match)
-- Ejecutar en Supabase: SQL Editor > New query > pegar todo > Run

create table public.solicitudes (
  id bigint generated always as identity primary key,
  de_id uuid not null default auth.uid() references public.perfiles (id) on delete cascade,
  para_id uuid not null references public.perfiles (id) on delete cascade,
  rawg_id integer not null,
  juego_nombre text not null check (char_length(juego_nombre) <= 200),
  estado text not null default 'pendiente' check (estado in ('pendiente', 'aceptada', 'rechazada')),
  creado_en timestamptz not null default now(),
  check (de_id <> para_id)
);

-- Una sola solicitud por pareja y juego, sin importar quién la envió
create unique index solicitudes_pareja_juego
  on public.solicitudes (least(de_id, para_id), greatest(de_id, para_id), rawg_id);

alter table public.solicitudes enable row level security;

-- Solo quien envía y quien recibe pueden ver la solicitud
create policy "Participantes ven sus solicitudes"
  on public.solicitudes for select
  to authenticated
  using ((select auth.uid()) in (de_id, para_id));

-- Solo se puede enviar a alguien que busca equipo en ese juego
create policy "Cada usuario envia sus solicitudes"
  on public.solicitudes for insert
  to authenticated
  with check (
    (select auth.uid()) = de_id
    and estado = 'pendiente'
    and exists (
      select 1 from public.juegos_buscando j
      where j.perfil_id = para_id and j.rawg_id = solicitudes.rawg_id
    )
  );

-- Solo quien recibe responde, y solo mientras esté pendiente
create policy "Quien recibe responde"
  on public.solicitudes for update
  to authenticated
  using ((select auth.uid()) = para_id and estado = 'pendiente')
  with check (estado in ('aceptada', 'rechazada'));

-- Al responder solo se puede cambiar el estado
revoke update on public.solicitudes from authenticated;
grant update (estado) on public.solicitudes to authenticated;
