# Créditos de assets

## Assets fornecidos pelo usuário

- `Graphics.zip` foi usado como fonte dos sprites de treinadores, portas e do tileset de cidade.
- `All Sprites(5).zip` foi recebido durante a revisão para consulta de sprites adicionais, mas não foi usado como fonte primária dos NPCs desta versão.
- Os screenshots em `src/assets/projects/` foram fornecidos pelo usuário e mostram o projeto Guarda-vidas.

## Sprites de treinadores usados

`src/assets/characters.png` foi montado a partir dos arquivos nomeados de `Graphics/Characters/` do `Graphics.zip` enviado pelo usuário. Os doze slots principais do atlas de overworld são:

1. Red — `trainer_POKEMONTRAINER_Red.png`
2. Leaf — `trainer_POKEMONTRAINER_Leaf.png`
3. Brendan — `trainer_POKEMONTRAINER_Brendan.png`
4. May — `trainer_POKEMONTRAINER_May.png`
5. Dawn — `trainer_TRAINER_Dawn.png`
6. Lucas — `trainer_TRAINER_Lucas.png`
7. Serena — `trainer_TRAINER_Serena.png`
8. Ethan — `trainer_TRAINER_Ethan.png`
9. Cynthia — `trainer_TRAINER_Cynthia.png`
10. Calem — `trainer_TRAINER_Calem.png`
11. Hilbert — `trainer_TRAINER_Hilbert.png`
12. Hilda — `trainer_TRAINER_Hilda.png`

Os doze slots são mantidos como variantes únicas para os treinadores principais do mapa; NPCs secundários podem repetir algumas dessas variantes.

## Sprites de batalha usados nos diálogos

As falas dos NPCs usam sprites de batalha locais extraídos de `Graphics/Trainers/` no `Graphics.zip` fornecido pelo usuário. O componente escolhe o sprite de batalha pelo mesmo índice de variante do atlas externo, de modo que o retrato de Red continua sendo Red, Leaf continua sendo Leaf, e assim por diante.

- Red: `POKEMONTRAINER_Red.png`
- Leaf: `POKEMONTRAINER_Leaf.png`
- Brendan: `POKEMONTRAINER_Brendan.png`
- May: `POKEMONTRAINER_May.png`
- Dawn: `TRAINER_Dawn.png`
- Lucas: `TRAINER_Lucas.png`
- Serena: `TRAINER_Serena.png`
- Ethan: `TRAINER_Ethan.png`
- Cynthia: `TRAINER_Cynthia.png`
- Calem: `TRAINER_Calem.png`
- Hilbert: `TRAINER_Hilbert.png`
- Hilda: `TRAINER_Hilda.png`

Arquivos incorporados localmente em `src/assets/trainers/battle/` para eliminar dependência de URLs externas nos retratos de treinador.

## Correções técnicas desta versão

- O atlas `src/assets/characters.png` agora é carregado como 4 colunas × 48 linhas (12 personagens × 4 direções × 4 poses). A configuração anterior estava invertida, causando leitura incorreta dos frames e repetição aparente de personagens.
- Os Pokémon de overworld do mapa são sprites standalone 64×64 com `frame: 0`; caminhada altera posição e espelhamento horizontal, nunca o frame a cada passo.

## Construções e portas

As novas construções `build-town-*.png` foram recortadas do arquivo fornecido pelo usuário em `Graphics/Tilesets/Town.png`, mantendo o pixel art original e sem criar esboços artificiais.

As portas `door-wood.png` e `door-modern.png` foram extraídas de `Graphics/Characters/doors1.png` e `Graphics/Characters/doors3.png`, respectivamente. O motor usa essas portas como sprites únicos e anima a abertura por transformação de escala, evitando a antiga faixa colorida vertical.

## Pokémon

Os sprites individuais em `src/assets/pokemon/*.png` já presentes no projeto continuam sendo usados para o overworld. Todos os Pokémon que circulam pelo mapa usam agora o mesmo modelo de sprite standalone do Pikachu, sem trocar frames do atlas a cada passo.

O atlas `src/assets/pokemon-real-overworld-map-atlas.png` foi preservado para referência. O mapa usa 27 PNGs standalone 64×64 derivados de `Graphics/Characters`, cobrindo Gen 1–9; durante a caminhada o sprite permanece no frame 0 e apenas a posição/espelhamento mudam.

## Screenshots dos projetos

- `src/assets/projects/guardavidas-dashboard.png`
- `src/assets/projects/guardavidas-reservar-sala.png`
- `src/assets/projects/guardavidas-reservar-computador.png`

Essas três imagens foram fornecidas pelo usuário nesta revisão.

Para Biblioteca, os repositórios públicos consultados não possuem screenshots de interface nos arquivos de imagem publicados; o portfólio continua usando o logo do projeto até receber uma captura real.

## Referências externas pesquisadas

- Team Aqua's Asset Repo: https://github.com/TeamAquasHideout/Team-Aquas-Asset-Repo
- The Spriters Resource — Pokémon Ruby/Sapphire overworld Pokémon: https://www.spriters-resource.com/game_boy_advance/pokemonrubysapphire/asset/8183/
- The Spriters Resource — Pokémon HeartGold/SoulSilver overworld trainers: https://www.spriters-resource.com/ds_dsi/pokemonheartgoldsoulsilver/asset/26955/
- OpenGameArt — 16x16 RPG Tileset (CC-BY-SA 3.0 / GPL 3.0): https://opengameart.org/content/16x16-rpg-tileset

Os links externos são referências de pesquisa. Esta versão não copia automaticamente assets desses sites sem verificar a licença correspondente.

## Pokémon overworld standalone por geração

**Gen 1:** Pikachu, Vulpix, Growlithe, Bulbasaur, Charmander, Psyduck, Arcanine.

**Gen 2:** Totodile, Hoppip, Wooper.

**Gen 3:** Mudkip, Trapinch, Cacnea, Flygon.

**Gen 4:** Turtwig, Shinx, Budew.

**Gen 5:** Sandile, Zorua, Litwick.

**Gen 6:** Delphox, Greninja, Yveltal.

**Gen 7:** Primarina, Golisopod, Mimikyu.

**Gen 8:** Dragapult, Zamazenta, Regidrago.

**Gen 9:** Great Tusk, Iron Treads, Roaring Moon.

Os 36 PNGs standalone foram derivados de arquivos `Graphics/Characters/*.png` do `Graphics.zip` fornecido pelo usuário. Sites como DeviantArt, The Spriters Resource e Pinterest foram pesquisados como referências; não foram tratados como prova de licença para copiar automaticamente qualquer imagem.

## Referências externas para barracas e interiores

As barracas ampliadas desta versão foram desenhadas localmente no engine, usando como referência visual coleções de barracas de mercado top-down. Entre as referências consultadas: Pixel Market Stalls, da Pixelmate AI (12 barracas PNG; uso pessoal/comercial gratuito; crédito não obrigatório, mas apreciado; recurso marcado como AI Assisted/Graphics): https://pixelmateai.itch.io/market-stalls

Também foi consultado Merchant tent, de yd no Liberated Pixel Cup/OpenGameArt, licenciado como CC0: https://lpc.opengameart.org/content/merchant-tent

Para proporções e organização de interiores RPG, foram consultados RPG Indoor Tileset: Expansion 1 (Redshrike/Jetrel, CC-BY 3.0/GPL) e os assets de Pokémon Center/Mart do The Spriters Resource: https://opengameart.org/content/rpg-indoor-tileset-expansion-1 e https://www.spriters-resource.com/game_boy_advance/pokemonfireredleafgreen/asset/3724/

Essas páginas foram usadas como referência de design/licença. Nenhum asset externo foi copiado para esta versão sem comprovação de licença compatível; as barracas novas são renderizadas pelo próprio engine a partir de primitivas locais.

## Referências web consultadas — 26/09/2026

- The Spriters Resource — Pokémon FireRed / LeafGreen: Overworld NPCs e Pokémon Center/Mart, consultados como referência visual de proporção, fachadas e apresentação de NPCs.
  https://www.spriters-resource.com/game_boy_advance/pokemonfireredleafgreen/asset/3698/
  https://www.spriters-resource.com/game_boy_advance/pokemonfireredleafgreen/asset/3724/
- Pixelmate AI — Pixel Market Stalls — FREE: referência visual para barracas coloridas; a página informa uso pessoal/comercial gratuito e crédito não obrigatório, mas desaconselha redistribuição standalone. Nenhum arquivo desse pack foi copiado para o projeto.
  https://pixelmateai.itch.io/market-stalls
- OpenGameArt — pacotes de tiles/props usados apenas como referência de composição e licença; nenhum asset externo de licença ambígua foi incorporado ao pacote final.

Os sprites efetivamente usados no mapa continuam sendo os assets locais fornecidos pelo usuário e recortados/adaptados do material já presente no projeto.

## Interiores livres consultados — 26/09/2026

- AxulArt's Basic Top-down Interior — CC BY 4.0; a página informa uso em projetos gratuitos e comerciais com crédito: https://axulart.itch.io/axularts-basic-top-down-interior
- Open RPG Fantasy Tilesets — CC0; inclui overworld, cidade e interiores de casas/lojas: https://finalbossblues.itch.io/openrtp-tiles
- RPG Indoor Tileset: Expansion 1 — CC-BY 3.0 / GPL 3.0, com créditos a Redshrike e Jetrel: https://opengameart.org/content/rpg-indoor-tileset-expansion-1

Esses pacotes foram usados nesta rodada como referências de organização e licença. O projeto não redistribui esses pacotes externos como se fossem assets próprios.

## Sprites de batalha de treinadores

O projeto usa retratos locais derivados apenas das folhas de treinadores fornecidas pelo usuário para garantir exibição confiável nas falas. Também foi consultado o diretório de trainer sprites do Pokémon Showdown como referência. O diretório informa que muitos sprites não são dos jogos e solicita crédito ao artista correspondente, além de indicar que os sprites não devem ser editados sem permissão; por isso esta versão não copia esses arquivos externos para o pacote.

Fonte de referência: https://play.pokemonshowdown.com/sprites/trainers/

## V7 — vínculo entre overworld e diálogo

- `src/lib/trainer-assets.ts` centraliza a ordem das 12 variantes e o mapeamento dos retratos de batalha. Isso evita que um NPC use no diálogo uma variante diferente da que aparece no mapa.
- O retrato de overworld dentro do diálogo usa o mesmo frame de repouso voltado para baixo do atlas `src/assets/characters.png`, em vez de exibir uma folha inteira de animação.
- `Guia` usa explicitamente a variante 0 (Red), igual ao NPC externo `Guia do Oásis` nesta versão; os demais aliases também seguem o índice real do NPC do mapa.
- Para Pokémon em diálogo, nenhum treinador de batalha é mostrado por engano; a área de batalha exibe apenas o Pokémon correspondente.
- O preview de batalha do Pokémon usa PNG estático da PokeAPI em vez de GIF animado, reduzindo trabalho de decodificação e tráfego.
- O loop compartilhado de água/fogo foi simplificado: ondas e espuma continuam animadas, mas os anéis/glints não criam um objeto animado por célula.

## Referências de interiores livres consultadas

- OpenGameArt — Roguelike Indoor pack, Kenney — CC0: https://opengameart.org/content/roguelike-indoor-pack
- OpenGameArt — "Modern Houses" Tileset TopDown, Ritpop — CC0: https://opengameart.org/content/modern-houses-tileset-topdown
- OpenGameArt — RPG Tileset, russpuppy — CC0: https://opengameart.org/content/rpg-tileset

Essas referências servem para propor paleta, organização de parede, piso e mobiliário. Elas não são redistribuídas como parte dos assets do projeto; os interiores atuais continuam desenhados com a estética própria do Desert Oasis.
