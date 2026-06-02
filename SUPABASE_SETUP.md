# Supabase para Login + Caçada ao Vivo

Esta versão funciona de duas formas:

1. **Sem Supabase:** login local de teste salvo no navegador. Bom para testar no PC, mas não sincroniza entre amigos.
2. **Com Supabase:** login real com email/senha, perfis de Mestre/Player e estado compartilhado da caçada.

## 1. Criar projeto no Supabase

Crie um projeto em https://supabase.com e abra:

- **Project Settings → API**: copie `Project URL` e `anon public key`.
- **SQL Editor**: cole e rode o SQL abaixo.

## 2. SQL do banco

```sql
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  display_name text,
  role text not null default 'player' check (role in ('master', 'player')),
  created_at timestamptz not null default now()
);

create table if not exists public.campaign_state (
  id text primary key default 'main',
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.campaign_state enable row level security;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, display_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)),
    'player'
  )
  on conflict (id) do nothing;
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

-- Perfis: usuários autenticados podem ler perfis para o app saber quem é Mestre/Player.
drop policy if exists "profiles_read_authenticated" on public.profiles;
create policy "profiles_read_authenticated"
on public.profiles for select
to authenticated
using (true);

-- O usuário pode atualizar apenas o próprio nome de exibição.
drop policy if exists "profiles_update_own_name" on public.profiles;
create policy "profiles_update_own_name"
on public.profiles for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id and role = (select role from public.profiles where id = auth.uid()));

-- Todos os logados podem ler a caçada.
drop policy if exists "campaign_read_authenticated" on public.campaign_state;
create policy "campaign_read_authenticated"
on public.campaign_state for select
to authenticated
using (true);

-- Somente Mestre pode criar/editar a caçada.
drop policy if exists "campaign_master_insert" on public.campaign_state;
create policy "campaign_master_insert"
on public.campaign_state for insert
to authenticated
with check (exists (select 1 from public.profiles where id = auth.uid() and role = 'master'));

drop policy if exists "campaign_master_update" on public.campaign_state;
create policy "campaign_master_update"
on public.campaign_state for update
to authenticated
using (exists (select 1 from public.profiles where id = auth.uid() and role = 'master'))
with check (exists (select 1 from public.profiles where id = auth.uid() and role = 'master'));
```

## 3. Criar Mestre

Crie sua conta pelo próprio site com email/senha. Depois, no Supabase SQL Editor, rode:

```sql
update public.profiles
set role = 'master', display_name = 'Mestre GYU'
where email = 'SEU_EMAIL_AQUI';
```

Exemplo:

```sql
update public.profiles
set role = 'master', display_name = 'Mestre GYU'
where email = 'mestre@cain.com';
```

Os demais usuários podem criar conta como Player pelo site.

## 4. Variáveis de ambiente na Vercel

No projeto da Vercel:

- **Settings → Environment Variables**

Adicione:

```env
VITE_SUPABASE_URL=https://SEU_PROJETO.supabase.co
VITE_SUPABASE_ANON_KEY=SUA_CHAVE_ANON_PUBLIC
VITE_MASTER_EMAIL=seu-email-de-mestre@exemplo.com
```

Depois clique em **Redeploy**.

## 5. Sobre imagens de NPC

O site permite:

- colar uma URL de imagem;
- fazer upload de imagem pequena, que é salva como texto base64 no estado da caçada.

Para one-shot e imagens pequenas funciona bem. Para campanhas longas com muitas imagens, o ideal no futuro é usar **Supabase Storage**.

## 6. Segurança simples

A proteção real vem do Supabase:

- Guest não entra na caçada ao vivo.
- Player lê a caçada e cria ficha local.
- Mestre edita a caçada.

Não coloque a `service_role key` no Vercel. Use apenas a `anon public key`.
