---
name: run-site
description: Build, run, and drive the NextLevelCode site. Use when asked to start the site, run the dev server, build it, check it, take a screenshot of a page, verify a visual change, or audit the rendered pages.
---

Site estático em Astro 7 (bun). Não há suíte de testes: a verificação é
`bun run build` + `bun run check` para o código, e
`.claude/skills/run-site/driver.mjs` para o que só existe depois do CSS
resolver — layout, contraste, palavras coladas.

O driver fala CDP direto por WebSocket, sem Playwright nem Puppeteer. Ele
precisa apenas de um binário Chromium no disco.

## Prerequisites

O bun já é o runtime do projeto. Além dele, um Chromium — o driver procura,
nesta ordem: `$BROWSER_BIN`, `/opt/google/chrome/chrome`, `/usr/bin/chromium`,
`/usr/bin/google-chrome`, `/opt/brave.com/brave-origin-beta/brave`.

Se nenhum existir, no Ubuntu:

```bash
sudo apt-get update && sudo apt-get install -y chromium-browser
```

Nesta máquina (Arch, sem Chrome) o caminho usado é um symlink para o Brave —
ver a seção Gotchas.

## Setup

```bash
bun install
```

## Build

```bash
bun run build     # gera ./dist — valida o frontmatter de todo conteúdo
bun run check     # tipos e acessibilidade nos .astro
```

Ambos precisam terminar limpos antes de qualquer commit.

## Run (agent path)

O driver **não sobe servidor**. Suba um antes:

```bash
bun run build
(bun run preview --port 4321 >/tmp/preview.log 2>&1 &)
timeout 30 bash -c 'until curl -sf http://localhost:4321/ >/dev/null; do sleep 0.5; done'
```

Use `preview` (serve o `dist/`) e não `dev` quando for verificar o resultado
final.

**Confirme a porta no log antes de fotografar.** `--port 4321` é preferência, não
exigência: com a porta ocupada, o `astro preview` sobe na 4322, 4323… e imprime
`Port 4321 is in use, trying another one...`. O driver continua apontando para a
4321 (`SITE_URL` padrão), ou seja, para o **servidor antigo** — que responde
normalmente e serve o `dist/` que ele carregou. O sintoma é uma captura com o
HTML novo e o CSS velho, e a conclusão errada de que o estilo do componente não
está sendo aplicado. Ou cheque o log:

```bash
grep -E 'Local|in use' /tmp/preview.log
```

Para parar:

```bash
ss -lptnH 'sport = :4321' | grep -oE 'pid=[0-9]+' | cut -d= -f2 | sort -u | xargs -r kill
```

Isso mata só a 4321. Se já houver sobra de sessões anteriores, varra a faixa
inteira antes de subir o próximo:

```bash
for p in 4321 4322 4323 4324; do ss -lptnH "sport = :$p" | grep -oE 'pid=[0-9]+' | cut -d= -f2; done | sort -u | xargs -r kill
```

`lsof` não está instalado nesta máquina; `ss` (do `iproute2`) está e é o que
funciona. Não use `pkill -f` com padrão amplo — ele casa com a própria linha
de comando do agente e mata a sessão.

### Auditar

O comando principal. Percorre as rotas e reporta o que build e `astro check`
não pegam. Sai com código 1 se achar algo.

```bash
bun .claude/skills/run-site/driver.mjs audit
bun .claude/skills/run-site/driver.mjs audit --width 390 --theme light
bun .claude/skills/run-site/driver.mjs audit /blog/ /sobre/      # rotas específicas
```

Sem rotas na linha de comando, ele audita **todas as páginas do
`dist/sitemap-0.xml`** mais o `/404`. Ou seja: **exige `bun run build` antes**, e
o que ele varre acompanha o conteúdo sozinho. Não mantenha lista de rotas à mão —
a que existia apontou para post e projeto já apagados, e como o `preview` serve a
página de 404 com status 200, a auditoria passava tendo auditado a tela de erro.

Cobertura completa antes de dar trabalho visual por concluído:

```bash
for t in dark light; do for w in 1440 390; do
  bun .claude/skills/run-site/driver.mjs audit --width $w --theme $t
done; done
```

Saída verificada: `✓ 36 rota(s) sem problemas  (1440px · dark)` nas quatro
combinações. São ~1 min por combinação — rode cada uma em chamada separada, que
as quatro juntas estouram o timeout padrão do Bash.

O que ele detecta — cada item já pegou bug real neste repositório:

| checagem | por que existe |
|---|---|
| palavras coladas | o Astro descarta o espaço antes de tag inline; aconteceu 6× |
| `.eyebrow` acima de 13px | dentro de `.prose`, `.prose h2` vence por especificidade |
| rolagem horizontal | quebra em mobile |
| elemento fora da viewport | idem |
| `border-image` + `border-radius` | o primeiro anula o segundo, silenciosamente |
| `<img>` sem `alt` | acessibilidade |

### Screenshot

```bash
bun .claude/skills/run-site/driver.mjs shot / --out /tmp/shots/home.png
bun .claude/skills/run-site/driver.mjs shot /blog/ --out /tmp/shots/blog.png --width 390 --theme light
bun .claude/skills/run-site/driver.mjs shot /sobre/ --out /tmp/shots/cv.png --scroll-to ".cv"
```

**Olhe a imagem depois de gerar.** O driver falha alto se o servidor estiver
fora, mas não sabe se o layout ficou certo.

### Inspecionar o DOM

```bash
bun .claude/skills/run-site/driver.mjs eval / "document.title"
bun .claude/skills/run-site/driver.mjs eval / "getComputedStyle(document.body).backgroundColor"
```

Saída verificada do segundo: `"rgb(2, 5, 17)"` — o navy da marca.

| flag | padrão | efeito |
|---|---|---|
| `--width` / `--height` | 1440 / 900 | viewport |
| `--theme` | `dark` | grava `data-theme` e `localStorage` |
| `--full` | — | página inteira em vez da dobra |
| `--scroll-to <sel>` | — | centraliza o elemento antes de fotografar; falha se não casar |
| `--animate` | — | **não** congela animações (ver Gotchas) |
| `SITE_URL` | `http://localhost:4321` | servidor alvo |
| `BROWSER_BIN` | auto | caminho do Chromium |

## Run (human path)

```bash
bun run dev     # http://localhost:4321
```

O `astro dev` do Astro 7 **roda como daemon** — retorna na hora e o servidor
fica em segundo plano. Não adianta procurar processo em primeiro plano:

```bash
bunx astro dev status
bunx astro dev logs
bunx astro dev stop
```

## Gotchas

- **Screenshot pega o meio da animação.** A marca do hero tem `logo-draw` com
  0.15s de atraso e `animation-fill-mode: both`; durante o atraso ela fica com
  `clip-path: inset(0 100% 0 0)` e **some inteira da foto**. O driver injeta
  `animation-duration: 0s` + `transition-duration: 0s`, o que faz tudo saltar
  para o estado final. Use `--animate` só se quiser capturar o movimento.

- **`Page.navigate` não rejeita quando a página não carrega.** Ele resolve
  normalmente e põe a falha em `errorText`. Sem checar isso o driver
  fotografa a tela de erro do Chromium e reporta sucesso — foi o primeiro bug
  do próprio driver.

- **`| tail` mascara o código de saída.** `cmd | tail -3; echo $?` mostra o
  exit do `tail`, sempre 0. Ao verificar se a auditoria falhou, rode sem pipe
  ou use `${PIPESTATUS[0]}`.

- **Sem Chrome nesta máquina.** Só Brave. O symlink usado é
  `/opt/google/chrome/chrome → /opt/brave.com/brave-origin-beta/brave-origin-beta`.
  **Nunca aponte para `/usr/bin/brave-origin-beta`**: é um wrapper que faz
  `exec ".../brave-origin" "$USER_FLAGS" "$BRAVE_FLAGS" "$FLAG" "$@"` e, com as
  variáveis vazias, passa três argumentos vazios ao navegador — o Chromium lê
  como alvos extras e responde `Multiple targets are not supported in headless
  mode`.

- **O driver espera `document.fonts.ready`.** Sem isso o screenshot sai com a
  fonte de fallback e o layout mede diferente do real.

## Troubleshooting

- **`net::ERR_CONNECTION_REFUSED`**: nenhum servidor no ar. Suba o `preview`
  como na seção acima.

- **`Nenhum Chromium encontrado`**: nenhum dos caminhos padrão existe. Defina
  `BROWSER_BIN=/caminho/do/binario`.

- **`navegador saiu com código 1` + `Multiple targets are not supported`**: o
  binário é o wrapper do Brave, não o lançador. Ver Gotchas.

- **`astro check` falha com "does not expose the programmatic API"**: o
  TypeScript subiu para 7.x. O projeto pina `^6` de propósito — reinstale com
  `bun add -d typescript@^6`.
