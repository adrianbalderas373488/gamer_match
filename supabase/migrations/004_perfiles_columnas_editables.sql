-- Día 10: el usuario solo edita lo que muestra el formulario de perfil.
-- discord_id, usuario y avatar_url vienen de Discord y no se pueden falsificar
-- (el botón "Abrir en Discord" de los matches usa discord_id).
-- Ejecutar en Supabase: SQL Editor > New query > pegar todo > Run

revoke update on public.perfiles from authenticated;
grant update (nivel, disponibilidad, steam_id) on public.perfiles to authenticated;

-- Mismo formato que valida la función de Steam (17 dígitos)
alter table public.perfiles
  add constraint steam_id_valido check (steam_id ~ '^7656119[0-9]{10}$');
