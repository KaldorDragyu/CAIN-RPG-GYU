# CAIN // Célula GYU

Site de apoio para a one-shot: regras de consulta, ficha digital, caçada ao vivo e Celular CAIN.

## Rodar localmente

```bash
npm install
npm run dev
```

## Publicar atualização

```bash
npm run build
git add -A
git commit -m "Atualiza perfil e ordens de missão"
git push
```

A Vercel atualiza automaticamente após o push.

## Observação do Mestre

As ordens de missão aparecem na caixa de entrada dos agentes. Se o botão de excluir mensagem não funcionar por permissão do Supabase, rode o arquivo `SUPABASE_MIGRATION_V20_DELETE_MESSAGES.sql` no SQL Editor.
