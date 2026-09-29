# Lucas Amaral — Interactive Developer Portfolio V9

> **Portfolio Quest · Desert Oasis** — portfólio de desenvolvedor apresentado como uma experiência 2D explorável em pixel art.

A V9 usa o projeto V8 como base e organiza a experiência para apresentação pública: o visitante pode caminhar pela cidade, conversar com NPCs, entrar em construções, conhecer projetos e tecnologias e iniciar uma batalha demonstrativa.

## 🎮 O que a V9 demonstra

- Overworld 2D com KAPLAY, colisão, câmera e movimentação.
- Sprites de treinadores de overworld e diálogos.
- Retratos e apresentação de personagens durante interações.
- Portas e transições entre cidade e interiores.
- Lago, praça e pontos de interesse.
- Construções e interiores usados como áreas do portfólio.
- Batalha Pokémon demonstrativa.
- Interface para desktop e telas menores.
- Dados de projetos e tecnologias integrados ao portfólio.

## 🛠️ Stack

- React
- TypeScript
- Vite
- KAPLAY
- Tailwind CSS
- Supabase (opcional)
- PokeAPI / dados de Pokémon

## 🚀 Rodar localmente

```bash
npm install
npm run dev
```

Validação:

```bash
npm run lint
npm run build
```

> O ZIP de publicação não inclui `node_modules`; instale as dependências novamente no computador antes de executar.

## 🔐 Variáveis de ambiente

Se quiser usar os recursos opcionais do Supabase, copie `.env.example` para `.env.local` e preencha as variáveis correspondentes. Não publique chaves privadas no GitHub.

## 📁 Estrutura

- `src/game/` — mundo, engine e transições.
- `src/components/game/` — shell, batalha e telas do jogo.
- `src/components/pixel/` — diálogos e interface pixel.
- `src/assets/` — construções, Pokémon, treinadores e imagens.
- `src/lib/` — dados do portfólio, batalha e integrações.

## 🌐 Deploy

O projeto foi preparado para Vercel com `vercel.json` e o comando de build `npm run build`.

## 📌 Apresentação

Uma demonstração curta pode seguir:

**cidade → NPC → diálogo/retrato → porta → interior → projetos → batalha**

## 🧩 Créditos

Consulte [`CREDITS.md`](./CREDITS.md) antes de reutilizar assets.
