-- Opcional para o Mestre conseguir excluir mensagens/ordens pelo painel.
-- Rode no SQL Editor do Supabase se o botão "Excluir mensagem" retornar erro de permissão.

drop policy if exists "inbox_delete_master" on public.inbox_messages;
create policy "inbox_delete_master"
on public.inbox_messages for delete
to authenticated
using (public.is_master());
