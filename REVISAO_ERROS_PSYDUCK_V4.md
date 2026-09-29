# Revisão de erros — Psyduck / V4

## Problema confirmado
O mapa referenciava 29 espécies de Pokémon em `src/game/world.ts`, mas apenas 20 delas estavam registradas no objeto `SPRITES` de `src/game/engine.ts`.

As referências ausentes eram:
- arcanine
- bulbasaur
- chansey
- charmander
- eevee
- flygon
- machop
- porygon
- psyduck

Isso podia produzir erro de runtime ao tentar criar `k.sprite("poke-psyduck")` e, pelos mesmos motivos, também para as outras oito espécies.

## Correção aplicada
Foram adicionados os 9 imports dos PNGs existentes em `src/assets/pokemon/` e os 9 registros correspondentes no `SPRITES`.

## Verificações
- TypeScript: 0 erros (`npx tsc --noEmit --pretty false`).
- ESLint: 0 erros e 7 warnings existentes.
- PNGs em `src/assets`: 75 válidos, 0 inválidos.
- Pokémon do `world.ts`: 29 referências, 29 registradas.
- Referências a `pokemon-real-overworld-map-atlas` no código: 0.
- Referências `kind: "duck"` no código: 0.
- Referência ao repositório antigo `Lucas-Amaral-dom/portfolio` no `src`: 0.

## Observação visual
`src/components/pixel/DialogueBox.tsx` ainda referencia `trainers-real-overworld-atlas.png`, enquanto o mapa usa `characters.png`. O arquivo existe, portanto isso não é erro de compilação/runtime, mas mantém dois atlas diferentes na UI de diálogo. Deve ser tratado em uma próxima revisão visual para unificar os retratos.

## Build
O código não acusou erro de TypeScript/ESLint. O `vite build` não pôde ser executado neste ambiente Linux porque o `node_modules` preparado para Windows não contém o binding nativo Linux do Rolldown.
