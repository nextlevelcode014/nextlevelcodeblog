# site

Site da **NextLevelCode** — estático, sem rastreadores e sem requisições para
domínios de terceiros.

Astro 7 + CSS puro, empacotado com **bun**. Tema escuro por padrão, com botão
para alternar para o claro.

## Rodar

```bash
bun install
bun run dev      # http://localhost:4321
bun run build    # gera ./dist
bun run preview  # serve o ./dist para conferir antes de publicar
bun run check    # checagem de tipos e de acessibilidade nos .astro
```

## Antes de publicar

Conferir e-mail e links em `src/site.config.ts`.

O domínio (`nextlevelcode.pro`) já está configurado em `astro.config.mjs` e em
`public/robots.txt` — se mudar, mude nos dois.

O `dist/` é HTML puro: funciona em qualquer hospedagem estática (Netlify,
Cloudflare Pages, um `nginx` seu, um bucket). Não precisa de Node no servidor.

## Onde mexer em cada coisa

| O que | Onde |
|---|---|
| Cores, tipografia, espaçamentos | `src/styles/tokens.css` |
| Estilos compartilhados (botões, cards, tags, texto de artigo) | `src/styles/global.css` |
| Menu, serviços, princípios, redes, e-mail | `src/site.config.ts` |
| Posts do blog | `src/content/blog/*.md` |
| Projetos | `src/content/projetos/*.md` |
| Campos obrigatórios de cada tipo de conteúdo | `src/content.config.ts` |

Estilos de uma página específica ficam no `<style>` do próprio `.astro` — eles
são escopados automaticamente, então não vazam para o resto do site.

## Escrever um post

O fluxo é o mesmo do Hugo: Markdown com frontmatter, e pronto.

```bash
bun run novo:post "Configurando WireGuard no Proxmox"
# → src/content/blog/configurando-wireguard-no-proxmox.md
```

O script tira acentos, monta o slug e preenche o cabeçalho com a data de hoje.
Nasce com `draft: true`, então dá para escrever sem risco de publicar pela
metade. Para projetos: `bun run novo:projeto "Nome"`.

Com `bun run dev` aberto, o texto recarrega sozinho a cada `:w`.

Se preferir criar o arquivo na mão, é só isso — o nome do arquivo vira a URL
(`/blog/meu-post/`):

```markdown
---
title: 'Título do post'
description: 'Uma frase que aparece na listagem e no Google.'
pubDate: 2026-07-29
tags: ['homelab', 'linux']
draft: false
---

Texto em Markdown.
```

Projetos seguem o mesmo padrão em `src/content/projetos/`, com os campos
`year`, `status` (`ativo` | `concluído` | `arquivado`) e `order` (ordena a
listagem; menor aparece primeiro). `repo` e `demo` são opcionais.

Duas coisas que o build garante para você:

- **`draft: true` some do site** — de listagens, tags, RSS e sitemap.
- **Frontmatter errado quebra o build**, não a página publicada. Se faltar a
  data ou uma tag não for texto, você descobre na hora de gerar, não depois.

### Tags

Não precisa cadastrar tag em lugar nenhum: as páginas `/tags/` e
`/tags/<nome>/` são geradas a partir do que existe nos posts e projetos.

Use tags **em minúsculas e sem acento** (`seguranca`, não `Segurança`). A tag
vira URL, e acento vira código percentual — funciona, mas fica feio de ler e de
compartilhar.

## Decisões que valem conhecer antes de mexer

- **Fontes self-hosted.** A Fonts API do Astro baixa Poppins e Inter no build
  e serve do próprio domínio. Nenhum visitante faz requisição ao Google.
- **Azul muda de tom no tema claro.** `#2196F3` sobre branco dá contraste
  3,1:1, abaixo do mínimo da WCAG; por isso texto e links usam `#1565C0` no
  claro. O azul da marca continua nos preenchimentos. Mesma lógica no laranja.
- **O `<script>` de tema é inline de propósito.** Ele roda antes da primeira
  pintura para não haver flash de tela clara. Se for movido para um arquivo
  externo, o flash volta.
- **Animações de entrada são CSS puro** (`animation-timeline: view()`), sem
  JavaScript. Onde o navegador não suportar, o conteúdo aparece normalmente.
- **O logo é polígono, não traço.** As pontas do original são cortes
  horizontais e inclinados, que `stroke-linecap` não reproduz. Ver o comentário
  em `src/components/Logo.astro`.

## Currículo

Coloque o PDF em `public/curriculo.pdf` e rode o build. O botão de download
aparece sozinho na barra lateral da página `/sobre/`, já com o tamanho do
arquivo calculado.

Se o arquivo não existir, o botão simplesmente não é renderizado — nunca há um
link de download apontando para 404. O contrário também vale: para tirar o
botão do ar, basta remover o PDF.

## Imagens da marca

`public/favicon.svg`, `public/apple-touch-icon.png` e `public/og.png` (a prévia
ao compartilhar o link) estão prontos, com Poppins e Inter.

O `og.png` foi rasterizado de um SVG com `rsvg-convert`, que usa as fontes
instaladas no sistema — se for regerar em outra máquina, precisa de
`inter-font` (repo extra) e `ttf-poppins` (AUR).
