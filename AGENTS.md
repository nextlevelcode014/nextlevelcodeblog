# AGENTS.md

Site estático da NextLevelCode (blog + projetos). **Astro 7 + CSS puro, com bun.**
O `CLAUDE.md` deste repositório é o guia profundo (arquitetura, design, regras de
escrita); o `README.md` cobre o fluxo de conteúdo. Este arquivo é o atalho do
agente e as armadilhas que nem o build nem o `astro check` pegam.

## Comandos

```bash
bun install
bun run dev                    # daemon do Astro 7 (ver abaixo)
bun run build                  # gera ./dist — valida o frontmatter de todo conteúdo
bun run preview                # serve o ./dist; é aqui que se confere o site real
bun run check                  # tipos e acessibilidade nos .astro
bun run novo:post "Título"     # cria src/content/blog/<slug>.md (draft: true)
bun run novo:projeto "Nome"
bunx astro dev stop|status|logs  # o dev do Astro 7 roda em segundo plano
```

- **bun sempre; nunca npm nem pnpm.** O `bun.lock` é versionado de propósito.
- Sem suíte de testes. A verificação é **`bun run build` + `bun run check`**, e
  ambos precisam terminar limpos antes de qualquer commit.
- **Rascunho aparece em `dev` e some em `build`** (via `import.meta.env.DEV` em
  `src/conteudo.ts`). Como o `preview` serve o `dist/`, é lá que se confere o que
  vai ao ar.

## Regras que se esquecem fácil

- **Leia conteúdo com `publicados('blog')` (`src/conteudo.ts`), nunca com
  `getCollection` direto.** `draft` é campo do schema deste site, não do Astro; o
  filtro mora só ali e o esquecimento vaza rascunho sem erro de build.
- **Página institucional nova precisa entrar à mão em `src/busca.ts`.** Post,
  projeto e tag entram sozinhos; as páginas são escritas no array `paginas`.
- **`z` importa de `astro/zod` (v4), não de `astro:content`** (depreciado).
- **TypeScript está pinado em `^6`** porque o `astro check` depende da API
  programática que o TS 7 ainda não expõe. Não atualize.
- **O processador de Markdown é o Sätteri**, não unified/remark. Prefira
  transformar no `.astro` a partir de `post.body`.
- **`<script>` de tema é inline de propósito** — roda antes da primeira pintura
  para não piscar tela clara.
- **URL do site em dois lugares:** `astro.config.mjs` (`site`) e
  `public/robots.txt`. Mudar o domínio exige os dois.
- **Nenhum recurso de terceiro no runtime** (o rodapé promete sem cookies nem
  rastreadores). Antes de adicionar dependência de runtime:
  ```bash
  grep -rhoE '<(script|link|img|iframe)[^>]*(src|href)="https?://[^"]*"' dist --include="*.html" | grep -v nextlevelcode.pro
  ```
- **`docs/servicos/*.md` é registro**, nada em `src/` lê. O site não vende e não
  anuncia atendimento; não reintroduza oferta de serviço sem o autor pedir.
- **Toda imagem nova deve passar por `bun run otimiza:img <caminho>` antes do commit.**
  O script remove metadados EXIF/GPS/XMP (via sharp) e otimiza o tamanho.
  Nunca commitar fotos diretamente do celular/câmera sem processar — metadados
  de localização e equipamento vazam para a produção.

## Armadilhas de renderização (o CSS/HTML quebra calado)

- **Espaço antes de tag inline é descartado** (`"no"` + `<span>próximo` vira
  `nopróximo`). Use `{' '}` ao quebrar linha antes de `<span>`, `<strong>` ou
  expressão. Confira o HTML em `dist/` ao mexer em texto com marcação.
- **`.prose` vence classes utilitárias por especificidade.** `.prose h2` (0,1,1)
  bate `.eyebrow` (0,1,0). Só ponha dentro de `.prose` o que é texto do artigo.
- **View Transitions destroem `<html>` e os elementos a cada navegação.** O
  `data-theme` precisa ser reaplicado em `astro:after-swap`; scripts de
  componente usam **delegação no `document`** com trava de idempotência
  (`window.__nlc*Bound`).
- **`border-image` anula `border-radius`** (só em divisória reta) e **não se
  aplica a tabela com `border-collapse: collapse`**.
- **`import.meta.url` em `.astro` aponta para `dist/` no build.** Para ler arquivo
  do projeto use `process.cwd()`.

## Verificação visual

Não há UI a cada mudança, mas antes de dar trabalho visual por concluído, suba o
`preview` (build antes) e rode o driver CDP:

```bash
bun .claude/skills/run-site/driver.mjs audit --width 390 --theme light
bun .claude/skills/run-site/driver.mjs shot /blog/ --out /tmp/shots/blog.png
```

Ele detecta palavras coladas, rolagem horizontal, `.eyebrow` grande, `border-image`
com `border-radius` e `<img>` sem `alt`. Sem rotas, audita o `dist/sitemap-0.xml`
inteiro — **exige `bun run build` antes**. Detalhes e gotchas (porta ocupada,
`BROWSER_BIN`, animação congelada) no `.claude/skills/run-site/SKILL.md`.

## Git e entrega

Remote é **Forgejo sobre Tailscale** (`forgejo.tail181a66.ts.net`), não GitHub:
`gh` não funciona. Duas identidades, e a distinção importa:

- **`tea` (API)** entra como `nextlevelcode`. Use para issue e para ler/editar PR:
  ```bash
  tea issues list --repo nextlevelcode/site
  tea pulls list --repo nextlevelcode/site
  tea pulls edit 43 --repo nextlevelcode/site -t "Título" -d "Corpo"
  ```
  Em `pulls edit`, `--repo` por extenso: o `-r` curto é `--add-reviewers` ali.
- **Git (SSH)** autentica como a conta **`vm-agent`**, o colaborador por onde os
  agentes de IA trabalham. O `origin` é HTTPS e **não tem credential helper** —
  `git push origin` falha com `could not read Username`. Empurre pelo SSH:
  ```bash
  git push ssh://git@forgejo.tail181a66.ts.net/nextlevelcode/site.git <branch>
  ```

**`vm-agent` abre PR, mas não empurra branch.** O push direto é recusado pelo
hook; o caminho é o **AGit flow** — empurrar a ponta da branch para
`refs/for/main/<topic>`, e o Forgejo cria (ou atualiza) o PR:

```bash
git push ssh://git@forgejo.tail181a66.ts.net/nextlevelcode/site.git \
  HEAD:refs/for/main/<topic>
```

O PR nasce com o título do commit empurrado e fica em `refs/pull/<n>/head`; um
novo push no mesmo `<topic>` atualiza o mesmo PR em vez de abrir outro. Ajuste
título e corpo depois com `tea pulls edit`.

- Fluxo: **branch → PR → squash merge**; crie a branch **antes** de começar. O
  passo a passo está nos comandos `/comecar` e `/entregar`.
- Abra issue para toda pendência em vez de só listá-la na resposta.
