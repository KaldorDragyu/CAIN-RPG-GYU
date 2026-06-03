-- Correção final: permite que o Mestre edite ordens/mensagens emitidas.
-- Rode no SQL Editor do Supabase se o botão "Salvar alteração" não atualizar a mensagem.

alter table public.inbox_messages
add column if not exists updated_at timestamptz default now();

drop policy if exists "inbox_update_master" on public.inbox_messages;
create policy "inbox_update_master"
on public.inbox_messages for update
to authenticated
using (public.is_master())
with check (public.is_master());
