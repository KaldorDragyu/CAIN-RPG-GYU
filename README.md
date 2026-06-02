# CAIN 1.3 — Site de apoio PT-BR

Site em **Vite + React + JavaScript + CSS**, feito para apoiar uma mesa privada de CAIN 1.3 com conteúdo resumido/parafraseado, ficha digital e ferramentas de consulta.

> Este projeto não inclui artes, PDF, fontes do livro nem tradução integral. Use o PDF comprado como referência oficial. O site serve como apoio de mesa.

## O que esta versão traz

- Resumo jogável das regras centrais.
- Consulta por abas: regras, criação, agendas, blasfêmias, kit, caçada, Admin, Pecados, oponentes e ferramentas.
- Ficha digital ampliada:
  - perguntas de criação do exorcista;
  - gerador de ID;
  - distribuidor inicial de perícias;
  - escolha de agenda e adição rápida de habilidade;
  - escolha de blasfêmia e adição rápida de poderes;
  - controle de CAT, PSYCHE, estresse, ferimentos, pathos, burst, pecado, overflow e marcas;
  - botões para aplicar estresse, estresse não letal, gastar burst, ganhar pecado e resolver overflow;
  - checklist de XP de fim de sessão;
  - acompanhamento de missões sobrevividas e CAT recomendado;
  - biblioteca local para várias fichas no mesmo navegador;
  - exportar/importar JSON;
  - impressão/salvar em PDF pelo navegador.
- Rolador de dados com rolagem difícil e dado de risco.
- Rastreador de talismãs.
- Criador simples de caçada e Pecado.

## Instalação no Debian

Atualize o sistema:

```bash
sudo apt update && sudo apt upgrade -y
```

Instale Node.js LTS. Uma forma simples é usar NodeSource:

```bash
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt install -y nodejs unzip
```

Confira:

```bash
node -v
npm -v
```

Extraia o projeto:

```bash
unzip cain-rpg-site-v13-ficha-plus.zip
cd cain-rpg-site-v13
```

Instale dependências:

```bash
npm install
```

Rode em desenvolvimento:

```bash
npm run dev
```

Abra no navegador:

```text
http://localhost:5173
```

## Gerar versão de produção

```bash
npm run build
```

O resultado fica em `dist/`.

Para pré-visualizar:

```bash
npm run preview
```

## Publicar na Vercel

1. Crie um repositório no GitHub com estes arquivos.
2. Acesse a Vercel e importe o repositório.
3. Framework: **Vite**.
4. Build command: `npm run build`.
5. Output directory: `dist`.
6. Publique.

## Privacidade

A Vercel normal deixa o site acessível para quem tiver o link. Para usar só com amigos, considere:

- link não indexado e compartilhado apenas com o grupo;
- proteção por senha simples no front;
- Cloudflare Access;
- autenticação com Supabase/Firebase numa futura versão.

## PHP opcional

A pasta `php/` tem um exemplo simples de endpoint para salvar JSON, mas a Vercel comum não executa PHP. Para salvar fichas online de verdade, prefira Supabase, Firebase ou uma API serverless.

## Observação legal

Este site é um resumo de apoio e não substitui o livro. Não redistribua o PDF, artes, fontes ou texto integral do livro.
