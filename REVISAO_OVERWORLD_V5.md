# Revisão Overworld V5 — estabilidade e acabamento

Data: 26/09/2026

## Correções aplicadas

- Os NPCs principais do exterior agora usam variantes 1–11, deixando a variante 0 (Red) reservada ao jogador. Isso remove a duplicação direta entre o jogador e o Guia do Oásis e mantém o conjunto principal sem repetição entre os personagens principais.
- Os moradores extras reutilizam variantes de forma controlada.
- Corrigidas três posições de NPC que estavam dentro dos footprints de construções (Workshop, Loja/Bazar e Arena).
- O bloqueio de roaming continua considerando `SOLID_TILES` e o footprint completo das construções, incluindo a área da porta, impedindo que NPCs e Pokémon autônomos entrem nas fachadas.
- Pokémon autônomos também evitam ocupar o mesmo tile de outro Pokémon.
- O diálogo de Pokémon agora é derivado do campo `poke` no momento da interação (`poke-${species}`), evitando que Mudkip, Psyduck ou outra espécie abra a conversa de Pikachu por erro de cadastro manual.
- Todos os 29 Pokémon do mapa possuem cobertura de diálogo explícita ou genérica.
- O painel de diálogo reconhece mais espécies para exibir sprite de batalha e usa um retrato do próprio Pokémon quando o falante é um Pokémon.
- As falas com `battleOpponentId` continuam mostrando o trainer sprite de batalha e o Pokémon de batalha quando disponíveis.
- As bordas semânticas do site foram mudadas para uma combinação azul-índigo + dourado/sand, aplicada aos `pixel-frame`, `pixel-frame-sm` e `pixel-press`.
- A barra superior ficou mais legível: os labels da navegação usam fonte normal maior, mantêm `whitespace-nowrap` e continuam em uma faixa horizontal rolável. O menu móvel também usa texto maior e normal.
- A areia (`s`) e o piso pavimentado (`p`) permanecem explicitamente fora de `SOLID_TILES`, portanto são caminháveis. As obstruções reais continuam bloqueadas.
- As barracas de mercado mantêm desenho local, mas foram ampliadas para 2×2 tiles com cobertura, balcão e mercadorias, evitando redistribuir um pack externo como se fosse parte do projeto.

## Auditoria estática

- Pokémon distintos no mapa: 29
- Pokémon sem sprite registrado: 0
- Pokémon sem diálogo: 0
- NPCs do exterior dentro de construções: 0
- 12 variantes principais de `characters.png`: 12
- Variantes principais únicas: sim
- PNGs inválidos encontrados em `src/assets`: 0
- Imports locais inexistentes: 0
- `@radix-ui/react-dropdown-menu`: 2.1.24

## Validação de código

TypeScript:
- `node node_modules/typescript/bin/tsc --noEmit --pretty false`
- Resultado: 0 erros

ESLint:
- `node node_modules/eslint/bin/eslint.js .`
- Resultado: 0 erros, 7 warnings existentes
- Warning novo não foi introduzido pela alteração de sprites/dialogue; o warning de React Hooks em `GameShell.tsx` já existia e os demais são avisos de Fast Refresh em componentes UI.

O comando `npm run lint` não foi executado diretamente neste ambiente Linux porque o pacote Windows preserva executáveis sem permissão POSIX; a mesma configuração do ESLint foi executada com `node node_modules/eslint/bin/eslint.js .` e retornou 0 erros.

O `npm run build` não pôde ser validado neste ambiente Linux com o `node_modules` de Windows. Para a confirmação final de build, execute `npm run build` no Windows onde o projeto será usado.

## Referências web consultadas

- The Spriters Resource — Pokémon FireRed / LeafGreen: Overworld NPCs:
  https://www.spriters-resource.com/game_boy_advance/pokemonfireredleafgreen/asset/3698/
- The Spriters Resource — Pokémon FireRed / LeafGreen: Pokémon Center / Mart:
  https://www.spriters-resource.com/game_boy_advance/pokemonfireredleafgreen/asset/3724/
- Pixelmate AI — Pixel Market Stalls — FREE:
  https://pixelmateai.itch.io/market-stalls

Essas páginas foram usadas como referência visual/licença. Os assets externos não foram copiados para o pacote V5 sem uma licença apropriada; as barracas V5 continuam sendo desenhadas localmente e os sprites do mapa continuam vindo dos assets fornecidos no projeto.
