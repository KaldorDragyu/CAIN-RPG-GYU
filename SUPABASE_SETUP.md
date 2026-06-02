# Supabase para Login + Caçada + Celular CAIN

Esta versão funciona de duas formas:

1. **Sem Supabase:** login local de teste salvo no navegador. Bom para testar no PC, mas não sincroniza entre amigos.
2. **Com Supabase:** login real com email/senha, perfis de Mestre/Player, caçada ao vivo, caixa de entrada, notas, contatos e chat.

## 1. Tirar confirmação de email

No Supabase, abra:

- **Authentication → Providers → Email**
- Desative **Confirm email** / **Confirm Email**
- Salve

Com isso, contas criadas por email/senha entram sem precisar clicar em link de confirmação. Se uma conta já foi criada antes com confirmação pendente, o mais fácil para teste é apagar esse usuário em **Authentication → Users** e criar de novo pelo site.

## 2. Variáveis de ambiente

No projeto da Vercel:

```env
VITE_SUPABASE_URL=https://SEU_PROJETO.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_...
VITE_MASTER_EMAIL=gyus2.crtti@gmail.com
```

Use a **Publishable key** (`sb_publishable_...`). Nunca coloque `sb_secret_...` no front-end.

## 3. SQL do banco

Cole e rode tudo abaixo em **Supabase → SQL Editor**.

```sql
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  display_name text,
  role text not null default 'player' check (role in ('master', 'player')),
  avatar_url text,
  character_name text,
  organization_title text default 'CAIN // Célula GYU',
  created_at timestamptz not null default now()
);

alter table public.profiles add column if not exists avatar_url text;
alter table public.profiles add column if not exists character_name text;
alter table public.profiles add column if not exists organization_title text default 'CAIN // Célula GYU';

create table if not exists public.campaign_state (
  id text primary key default 'main',
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.inbox_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  from_name text not null default 'CAIN',
  subject text not null,
  body text not null,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.player_notes (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  title text not null default 'Nota sem título',
  body text not null default '',
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists public.contacts (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  contact_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique(owner_id, contact_id)
);

create table if not exists public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid not null references public.profiles(id) on delete cascade,
  receiver_id uuid not null references public.profiles(id) on delete cascade,
  body text not null,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.campaign_state enable row level security;
alter table public.inbox_messages enable row level security;
alter table public.player_notes enable row level security;
alter table public.contacts enable row level security;
alter table public.chat_messages enable row level security;

create or replace function public.is_master(uid uuid default auth.uid())
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (select 1 from public.profiles where id = uid and role = 'master');
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, display_name, character_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)),
    case when lower(new.email) = lower('gyus2.crtti@gmail.com') then 'master' else 'player' end
  )
  on conflict (id) do nothing;

  insert into public.inbox_messages (user_id, from_name, subject, body)
  values (
    new.id,
    'CAIN // CENTRAL',
    'DOCREF // CHAMADO INICIAL',
    'Você foi anexado a uma célula de resposta rápida. O Administrador da operação irá liberar o briefing pessoal, ponto de encontro e instruções de missão.'
  )
  on conflict do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

insert into public.campaign_state (id, data)
values ('main', '{}'::jsonb)
on conflict (id) do nothing;

-- PROFILES

drop policy if exists "profiles_read_authenticated" on public.profiles;
create policy "profiles_read_authenticated"
on public.profiles for select
to authenticated
using (true);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own"
on public.profiles for insert
to authenticated
with check (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
on public.profiles for update
to authenticated
using (auth.uid() = id or public.is_master())
with check (auth.uid() = id or public.is_master());

-- CAMPAIGN

drop policy if exists "campaign_read_authenticated" on public.campaign_state;
create policy "campaign_read_authenticated"
on public.campaign_state for select
to authenticated
using (true);

drop policy if exists "campaign_master_insert" on public.campaign_state;
create policy "campaign_master_insert"
on public.campaign_state for insert
to authenticated
with check (public.is_master());

drop policy if exists "campaign_master_update" on public.campaign_state;
create policy "campaign_master_update"
on public.campaign_state for update
to authenticated
using (public.is_master())
with check (public.is_master());

-- INBOX

drop policy if exists "inbox_read_own_or_master" on public.inbox_messages;
create policy "inbox_read_own_or_master"
on public.inbox_messages for select
to authenticated
using (user_id = auth.uid() or public.is_master());

drop policy if exists "inbox_insert_master_or_own_seed" on public.inbox_messages;
create policy "inbox_insert_master_or_own_seed"
on public.inbox_messages for insert
to authenticated
with check (public.is_master() or user_id = auth.uid());

drop policy if exists "inbox_update_own_or_master" on public.inbox_messages;
create policy "inbox_update_own_or_master"
on public.inbox_messages for update
to authenticated
using (user_id = auth.uid() or public.is_master())
with check (user_id = auth.uid() or public.is_master());

-- NOTES

drop policy if exists "notes_owner_all" on public.player_notes;
create policy "notes_owner_all"
on public.player_notes for all
to authenticated
using (owner_id = auth.uid())
with check (owner_id = auth.uid());

-- CONTACTS

drop policy if exists "contacts_owner_or_master_read" on public.contacts;
create policy "contacts_owner_or_master_read"
on public.contacts for select
to authenticated
using (owner_id = auth.uid() or public.is_master());

drop policy if exists "contacts_owner_insert" on public.contacts;
create policy "contacts_owner_insert"
on public.contacts for insert
to authenticated
with check (owner_id = auth.uid());

drop policy if exists "contacts_owner_delete" on public.contacts;
create policy "contacts_owner_delete"
on public.contacts for delete
to authenticated
using (owner_id = auth.uid());

-- CHAT

drop policy if exists "chat_read_participants_or_master" on public.chat_messages;
create policy "chat_read_participants_or_master"
on public.chat_messages for select
to authenticated
using (sender_id = auth.uid() or receiver_id = auth.uid() or public.is_master());

drop policy if exists "chat_insert_sender" on public.chat_messages;
create policy "chat_insert_sender"
on public.chat_messages for insert
to authenticated
with check (sender_id = auth.uid());

-- Opcional: deixar seu email como Mestre caso já tenha criado conta.
update public.profiles
set role = 'master', display_name = 'Mestre GYU', character_name = 'Mestre GYU'
where lower(email) = lower('gyus2.crtti@gmail.com');
```

## 4. Como usar na mesa

- **Guest:** vê regras abertas.
- **Player:** cria ficha, vê missão, caixa de entrada, notas, amigos e chat.
- **Mestre:** controla caçada, vê players, envia mensagens individuais para a caixa de entrada e monitora chat.

Quando você quiser criar a mensagem inicial do Marco Kirstein, entre como Mestre → **Perfil → Mestre** e envie uma mensagem individual para o player escolhido.
