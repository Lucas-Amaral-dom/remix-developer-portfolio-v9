# Revisão Overworld V3

## Problemas corrigidos

1. O atlas de trainers estava sendo carregado com `sliceX` e `sliceY` invertidos. Para `characters.png` (12 sheets verticais de 128x192), o carregamento correto é `sliceX: 4` e `sliceY: 48`. O cálculo de frame continua `variant × 16 + direção × 4 + pose`.
2. Os Pokémon do mapa agora usam PNGs standalone 64x64 derivados das células de overworld do `Graphics.zip`; o movimento não troca frame a cada passo.
3. Foram adicionadas 36 variantes standalone na pasta `src/assets/pokemon`, cobrindo as Gerações 1 a 9 e mantendo também as espécies que já estavam no mapa.
4. O `lab` deixou de usar a fachada simplificada `build-lab.png` e passou a usar a construção real `build-town-greenhall.png`. `arena` e `shop` também apontam para construções reais de `Town`.
5. As posições dos novos Pokémon foram validadas contra `SOLID_TILES` e não há Pokémon novos sobre tiles sólidos.
6. `Psyduck` permanece como Pokémon, mas foi retirado da água sólida para caminhar pela área de passeio.
7. O atlas de trainers foi reconstruído com 12 protagonistas/personagens principais únicos: Red, Leaf, Brendan, May, Ethan, Dawn, Lucas, Hilbert, Hilda, Serena, Calem e Cynthia.

## Pokémon usados

Gen 1: Pikachu, Vulpix, Growlithe, Bulbasaur, Charmander, Psyduck, Arcanine
Gen 2: Totodile, Hoppip, Wooper
Gen 3: Mudkip, Trapinch, Cacnea, Flygon
Gen 4: Turtwig, Shinx, Budew
Gen 5: Sandile, Zorua, Litwick
Gen 6: Delphox, Greninja, Yveltal
Gen 7: Primarina, Golisopod, Mimikyu
Gen 8: Dragapult, Zamazenta, Regidrago
Gen 9: Great Tusk, Iron Treads, Roaring Moon

## Pesquisa de fontes externas

Foram pesquisadas fontes de overworld e tilesets. The Spriters Resource tem folhas de Pokémon Overworld de Ruby/Sapphire e FireRed/LeafGreen. O Team Aqua's Asset Repo declara ser uma coleção de assets de uso livre para hacking de Pokémon Gen 3 e mantém categorias específicas de Overworld Pokemon Sprites e Overworld Trainer Sprites.

No DeviantArt foram encontradas, entre outras, coleções de overworld da comunidade. Algumas têm permissão explícita, como a de Boonzeet para Dawn em estilo Gen 4, indicada como CC BY-NC-ND 3.0 e “Free to use with credit”; essa licença não foi tratada como permissão para editar/cropá-la. A página de TrainerDX declara bases de trainer “free to use with credit”.

Pinterest foi consultado apenas como referência visual/índice. Um pin não comprova a licença do asset original, então os assets externos não foram copiados automaticamente para o projeto. Nesta versão, as imagens novas vêm do `Graphics.zip` fornecido pelo usuário, onde já havia um grande acervo de sprites de Characters cobrindo diversas gerações.

## Validação

- TypeScript: 0 erros (`npx tsc --noEmit --pretty false`)
- ESLint: 0 erros / 7 warnings já existentes
- PNGs dos Pokémon standalone: 36 válidos
- Pokémon do mapa: 32 instâncias, 0 posições sobre `SOLID_TILES`
- Dependência `@radix-ui/react-dropdown-menu`: 2.1.24

## Observação sobre build

O pacote Windows contém `node_modules` da plataforma Windows. O build não foi executado dentro do ambiente Linux desta revisão porque o binding nativo do Rolldown é dependente da plataforma. No Windows do usuário, executar `npm run build` depois de extrair o pacote é a validação final de produção.
