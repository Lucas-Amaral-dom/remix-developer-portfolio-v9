# Versão pronta para Windows

Esta cópia foi preparada para o Node.js LTS / npm LTS do projeto.

A dependência crítica `@radix-ui/react-dropdown-menu` está fixada em `2.1.24` tanto no `package.json` quanto no `package-lock.json`, e a pasta `node_modules` incluída nesta distribuição já contém essa versão.

## Executar

```powershell
npm run dev
```

Depois abra `http://localhost:3000`.

## Validações feitas nesta revisão

- TypeScript: 0 erros
- ESLint: 0 erros; 7 warnings existentes do projeto
- Assets PNG: 0 arquivos inválidos
- `@radix-ui/react-dropdown-menu`: 2.1.24
- Pokémon do overworld: sprites standalone, sem troca de frame por passo
- NPCs: doze variantes principais únicas no atlas
- Construções: duas fachadas do mapa foram substituídas por construções reais do `Graphics.zip`
- Porta da fachada: removido o overlay vertical vermelho/azul; a porta faz parte da construção e recebe apenas brilho de proximidade
- Screenshots locais: adicionados para o projeto Guarda-vidas

- Pokémon overworld: 27 sprites standalone (3 por geração, Gen 1–9)
- Caminhada de Pokémon: sem troca de frame a cada passo
- Lab: fachada real `town-greenhall` substitui `build-lab.png` no mapa


## V6 — estabilidade visual e desempenho
- Retratos de treinadores nas falas usam assets locais para não depender de hotlink remoto.
- Animações de props estáticos foram reduzidas; a água continua com um único loop compartilhado e limitado a 24 FPS.
- A tela de quatro insígnias usa área interna rolável para não esconder o texto final em telas menores.

- Retrato de overworld nas falas: usa exatamente o frame idle/down do mesmo atlas e variante do NPC externo.
- Retratos de batalha: mapeamento centralizado em `src/lib/trainer-assets.ts`.
- Preview de batalha Pokémon: PNG estático, sem GIF animado.
- Performance: loops de fogo e água compartilhados; menos objetos animados por tile de água.
