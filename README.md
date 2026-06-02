# CAIN RPG GYU — Site de apoio de mesa

Site em **Vite + React** para jogar CAIN 1.3 com seu grupo: regras resumidas, criação de ficha, biblioteca local de personagens, rolador, talismãs, aba **Caçada ao Vivo** e um **Celular CAIN** com caixa de entrada, anotações, contatos e chat.

Não inclui PDF, artes do livro, páginas escaneadas nem tradução integral. É um companheiro de mesa com conteúdo resumido/parafraseado para uso privado com seu grupo.

## Funções principais

- Login como **Guest**, **Player** ou **Mestre**.
- Guest vê regras e consulta básica.
- Player cria ficha, consulta regras, acompanha briefing/NPCs revelados e usa o **Perfil/Celular CAIN**.
- Perfil/Celular CAIN inclui caixa de entrada, bloco de anotações, amigos/contatos e chat interno.
- Mestre controla:
  - organização/logo da missão;
  - texto de abertura e briefing;
  - NPCs com imagem, nome, status e informações públicas/secretas;
  - aliados e exorcistas com estresse/ferimentos/morte;
  - inimigos/Pecados com Talismã de Execução;
  - Tensão e Pressão;
  - registros públicos e secretos da missão;
  - mensagens individuais para a caixa de entrada de cada player;
  - monitor de chats.
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
npm config set registry https://registry.npmjs.org/
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
4. Em **Authentication → Providers → Email**, desative **Confirm Email** se não quiser confirmação por email.
5. Atualize seu perfil para `master` no SQL se necessário.
6. Configure as variáveis na Vercel:

```env
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
VITE_MASTER_EMAIL=...
```

Depois faça **Redeploy** na Vercel.


## Celular CAIN / Perfil do jogador

A aba **Perfil** funciona como um celular interno da organização:

- **Caixa:** mensagens do Mestre e comunicados de CAIN.
- **Notas:** bloco de anotações privado do jogador.
- **Amigos:** contatos adicionados pelo player.
- **Chat:** conversa com Mestre e contatos.
- **Perfil:** nome do exorcista, nome de perfil, organização e avatar por URL.
- **Mestre:** disponível só para Mestre; permite enviar mensagens individuais para players e monitorar chats.

No começo cada player recebe uma mensagem padrão de CAIN. Depois, você pode enviar mensagens diferentes para cada personagem, por exemplo Marco Kirstein, Vergil, Dante etc.

## Fluxo recomendado para sua one-shot

1. Mestre entra no login de Mestre.
2. Vai em **Caçada**.
3. Coloca logo da organização, título da missão e briefing público.
4. Cria NPCs e marca quais ficam visíveis aos players.
5. Cria o Pecado/Inimigo e define o Talismã de Execução.
6. Mestre abre **Perfil → Mestre** e envia mensagens individuais de briefing para a caixa de entrada de cada player.
7. Players entram com login próprio, abrem **Perfil** para ler a caixa de entrada e depois **Caçada** para ver o dossiê público.
8. Durante o jogo, Mestre usa Tensão/Pressão, logs públicos/secretos e os controles de stress/cortes.

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

## Atualização automática v16

A aba **Caçada ao Vivo** e o **Celular CAIN** agora fazem auto-sincronização. Quando o Mestre salva NPC, briefing, tensão, pressão, registro ou mensagem, os players recebem a atualização sem precisar clicar em “Atualizar missão”.

Mesmo assim existe um botão **Atualizar agora** como plano B. O site usa Realtime do Supabase quando possível e também consulta o banco a cada poucos segundos como segurança.

Depois de atualizar no GitHub, rode o SQL extra de Realtime no final do arquivo `SUPABASE_SETUP.md`.


## Atualização v17 — visual da caçada

- Cards de atores agora têm cor por tipo: NPC azul, Exorcista/Aliado amarelo, Inimigo/Boss vermelho.
- Adicionado tipo **Boss** no elenco da caçada.
- Imagens de NPCs, exorcistas e inimigos agora usam por padrão **Mostrar inteira**, evitando cortar ou esticar o personagem.
- Cada ator possui opção **Enquadramento da imagem**: `Mostrar inteira` para retratos/corpo completo ou `Preencher box` para imagens horizontais/cenários.
