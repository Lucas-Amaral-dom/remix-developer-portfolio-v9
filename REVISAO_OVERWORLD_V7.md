# Revisão Overworld V7 — diálogos, interiores e desempenho

## Correções desta rodada

- `src/lib/trainer-assets.ts` centraliza as 12 variantes de treinadores do atlas e o mapeamento dos sprites de batalha.
- `DialogueBox.tsx` usa o mesmo índice de variante do NPC externo. O retrato de overworld no diálogo é agora somente o primeiro frame da direção `down` do mesmo atlas, em vez de exibir a folha inteira.
- O diálogo `city-guide` usa `Guia` -> variante 1, igual ao NPC externo `Guia do Oásis` (Leaf).
- Sprites de batalha locais de Red, Leaf, Brendan, May, Dawn, Lucas, Serena, Ethan, Cynthia, Calem, Hilbert e Hilda são usados sem depender de hotlink remoto.
- Falas de Pokémon não mostram mais por engano um treinador de batalha; o preview usa apenas o Pokémon quando o speaker é uma espécie.
- O preview de batalha do Pokémon usa PNG estático da PokeAPI, eliminando GIF animado dentro da caixa de diálogo.
- A água continua bloqueada como água profunda; areia, pavimento e margem permanecem caminháveis. Não foi adicionada mecânica de natação nesta rodada.
- O loop compartilhado do overworld continua responsável por água, fogo e profundidade, e os efeitos da água foram simplificados para reduzir quantidade de objetos animados.
- O fogo das tochas/campfire foi consolidado em um loop compartilhado em vez de múltiplos callbacks independentes.
- O projeto continua com exatamente 8 construções na cidade; nenhuma construção nova foi adicionada. A Central de Créditos continua ocupando uma das construções existentes.
- As paredes internas mantêm paletas secas de madeira, pedra e reboco; não usam azul de água para representar paredes.
- As barracas de camping continuam maiores que um tile e foram mantidas na área existente perto da fogueira.
- A tela das 4 insígnias mantém contraste de texto melhorado.

## Auditoria estática

- Pokémon referenciados no `world.ts`: 29
- Pokémon registrados no `engine.ts`: 36
- Pokémon sem registro: []
- Construções na cidade: 8
- Sprites de batalha locais importados: 12
- Sprites de batalha importados sem arquivo: 0
- `@radix-ui/react-dropdown-menu`: 2.1.24

## Validação

- `npx tsc --noEmit --pretty false`: 0 erros.
- `npm run lint`: 0 erros, 7 warnings existentes do projeto.
- `npm ls @radix-ui/react-dropdown-menu --depth=0`: 2.1.24.
- `npm run build`: não executável neste ambiente Linux porque o `node_modules` desta cópia é Windows e não contém `@rolldown/binding-linux-x64-gnu`; isso é uma incompatibilidade do ambiente, não um erro reportado pelo TypeScript.

## Fontes de referência de interiores

- OpenGameArt — Roguelike Indoor pack — Kenney — CC0: https://opengameart.org/content/roguelike-indoor-pack
- OpenGameArt — Modern Houses Tileset TopDown — Ritpop — CC0: https://opengameart.org/content/modern-houses-tileset-topdown
- OpenGameArt — RPG Tileset — russpuppy — CC0: https://opengameart.org/content/rpg-tileset

Essas fontes foram consultadas como referência de composição, paredes, pisos e mobiliário. Os interiores atuais do projeto continuam sendo desenhados com a estética própria do Desert Oasis.
