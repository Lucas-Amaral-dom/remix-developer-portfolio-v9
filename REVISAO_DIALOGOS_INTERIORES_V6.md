# Revisão V6 — diálogos, interiores, caminho e Central de Créditos

## Correções aplicadas

- Alinhado o mapeamento de variantes de treinador entre NPC externo e retrato de diálogo.
- Criados diálogos específicos para NPCs secundários que antes reutilizavam diálogos com outro `speaker`, evitando que o retrato mostrasse o treinador errado.
- Mantidos os sprites de batalha locais em `src/assets/trainers/battle/`; o diálogo usa o mesmo índice de variante do NPC do mapa.
- Corrigido o retrato overworld em `DialogueBox` para usar PNG standalone da variante em repouso, em vez de recortar o atlas inteiro por CSS.
- Interiores: a borda usa `V` (parede interna seca) em vez de `W` (água/cachoeira); o piso `q` foi aquecido para reduzir a aparência de água.
- Mantidos estilos internos distintos por cena sem copiar um interior oficial de Pokémon; a composição foi inspirada em tilesets top-down livres consultados.
- Removida a construção `town-flowerhouse` do caminho inferior. A Central de Créditos continua acessível por uma placa interativa e pelo menu/terminal, sem criar um oitavo bloqueio de mapa.
- A cidade ficou com 7 construções visíveis no `CITY_BUILDINGS`.
- A água do lago continua sólida no motor, enquanto a margem e o píer permanecem caminháveis; isso é intencional até existir uma mecânica de natação.
- O texto final da celebração das 4 insígnias foi colocado em caixas escuras com texto claro para manter contraste.
- `@radix-ui/react-dropdown-menu` permanece fixado em `2.1.24` no `package.json` e `package-lock.json`.

## Validação

- TypeScript: 0 erros (`npx tsc --noEmit --pretty false`)
- ESLint: 0 erros / 7 warnings já existentes do projeto
- PNG: 109 arquivos válidos / 0 inválidos na pasta `src/assets`
- Pokémon referenciados pelo mapa: 29 / 29 registrados no `SPRITES`
- Construções visíveis no mapa: 7
- `town-flowerhouse` ativo: não
- Cena `credits`: presente e acessível

## Fontes externas consultadas

- OpenGameArt — `Interior spritesheet 16x16 tiles`, CC0: https://opengameart.org/content/interior-spritesheet-16x16-tiles
- OpenGameArt — `Modern Houses Tileset TopDown`, CC0: https://opengameart.org/content/modern-houses-tileset-topdown
- OpenGameArt — `Roguelike Indoor pack`, Kenney, CC0: https://opengameart.org/content/roguelike-indoor-pack
- OpenGameArt — `RPG Urban Pack`, Kenney, CC0: https://opengameart.org/content/rpg-urban-pack

Os recursos externos foram usados como referência de composição, proporção e organização. Nenhum pacote externo foi incorporado ao projeto sem uma licença compatível; os interiores desta versão continuam sendo desenhados no motor com os assets locais.
