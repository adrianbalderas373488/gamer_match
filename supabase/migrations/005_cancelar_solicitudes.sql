-- Día 11: quien envía una solicitud puede cancelarla mientras nadie la ha respondido.
-- Al borrarla se libera la pareja y el juego, así que se puede volver a enviar.
-- Ejecutar en Supabase: SQL Editor > New query > pegar todo > Run

create policy "Quien envia cancela mientras esta pendiente"
  on public.solicitudes for delete
  to authenticated
  using ((select auth.uid()) = de_id and estado = 'pendiente');
