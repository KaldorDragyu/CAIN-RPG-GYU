-- Permissões do Mestre para gerenciar mensagens/ordens pelo painel.
-- Rode no SQL Editor do Supabase se excluir ou editar mensagens retornar erro de permissão.

alter table public.inbox_messages
add column if not exists updated_at timestamptz default now();

drop policy if exists "inbox_delete_master" on public.inbox_messages;
create policy "inbox_delete_master"
on public.inbox_messages for delete
to authenticated
using (public.is_master());

drop policy if exists "inbox_update_master" on public.inbox_messages;
create policy "inbox_update_master"
on public.inbox_messages for update
to authenticated
using (public.is_master())
with check (public.is_master());
