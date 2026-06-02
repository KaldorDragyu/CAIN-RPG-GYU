# CAIN RPG GYU — Site de apoio de mesa

Site em **Vite + React** para jogar CAIN 1.3 com seu grupo: regras resumidas, criação de ficha, biblioteca local de personagens, rolador, talismãs e uma aba **Caçada ao Vivo** com visão de Mestre/Player/Guest.

Não inclui PDF, artes do livro, páginas escaneadas nem tradução integral. É um companheiro de mesa com conteúdo resumido/parafraseado para uso privado com seu grupo.

## Funções principais

- Login como **Guest**, **Player** ou **Mestre**.
- Guest vê regras e consulta básica.
- Player cria ficha, consulta regras e acompanha briefing/NPCs revelados.
- Mestre controla:
  - organização/logo da missão;
  - texto de abertura e briefing;
  - NPCs com imagem, nome, status e informações públicas/secretas;
  - aliados e exorcistas com estresse/ferimentos/morte;
  - inimigos/Pecados com Talismã de Execução;
  - Tensão e Pressão;
  - registros públicos e secretos da missão.
- Funciona sem backend em modo local de teste.
- Pode sincronizar online com Supabase.

## Instalação no Debian

```bash
sudo apt update
sudo apt install -y nodejs npm git unzip
```

Entre na pasta do projeto:

```bash
cd cain-rpg-site-v13
npm install
npm run dev
```

Abra:

```text
http://localhost:5173
```

## Build de produção

```bash
npm run build
npm run preview
```

A pasta final é:

```text
dist
```

## Publicar na Vercel

1. Envie o projeto para o GitHub.
2. Na Vercel, importe o repositório.
3. Configure:

```text
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

## Usar sem Supabase

Sem variáveis de ambiente, o site ativa login local de teste.

Na tela de login, clique em **Criar contas locais de teste**.

Contas criadas:

```text
Mestre: mestre@cain.com / mestre123
Player: vergil@cain.com / player123
Player: dante@cain.com / player123
```

Esse modo é ótimo para testar, mas não sincroniza entre computadores.

## Usar com Supabase

Leia o arquivo:

```text
SUPABASE_SETUP.md
```

Resumo:

1. Crie um projeto no Supabase.
2. Rode o SQL do arquivo `SUPABASE_SETUP.md`.
3. Crie sua conta pelo site.
4. Atualize seu perfil para `master` no SQL.
5. Configure as variáveis na Vercel:

```env
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
VITE_MASTER_EMAIL=...
```

Depois faça **Redeploy** na Vercel.

## Fluxo recomendado para sua one-shot

1. Mestre entra no login de Mestre.
2. Vai em **Caçada**.
3. Coloca logo da organização, título da missão e briefing público.
4. Cria NPCs e marca quais ficam visíveis aos players.
5. Cria o Pecado/Inimigo e define o Talismã de Execução.
6. Players entram com login próprio e abrem **Caçada** para ver o dossiê público.
7. Durante o jogo, Mestre usa Tensão/Pressão, logs públicos/secretos e os controles de stress/cortes.

## Como funcionam os controles de morte

### Aliados, NPCs e exorcistas

- Marque stress com os botões `+1`, `+2`, `+3`.
- Quando o stress enche, o ator ganha 1 ferimento e o stress zera.
- Com 3 ferimentos, o próximo stress marca morte.
- Stress não letal não enche o talismã.

### Inimigos/Pecados

- Use o campo **Talismã de Execução máximo**.
- Cada sucesso/counter/ataque que avançar a execução marca cortes.
- Quando o talismã enche, o inimigo é marcado como derrotado/executado.
- Se seu Pecado tiver segunda fase, use o status para marcar “Fase 2” e reduza/reset o talismã conforme sua preparação.

## Observação sobre imagens

Upload de imagem pequena é salvo dentro do estado da caçada como base64. Para muitas imagens, prefira colar URLs ou futuramente migrar para Supabase Storage.
