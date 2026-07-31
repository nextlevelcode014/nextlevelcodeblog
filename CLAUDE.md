# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Site institucional estático da NextLevelCode. **Astro 7 + CSS puro, empacotado com bun.**
O README cobre o fluxo de uso (escrever posts, publicar); este arquivo cobre o que
não é óbvio ao ler o código.

## Comandos

```bash
bun install
bun run dev                    # servidor de desenvolvimento
bun run build                  # gera ./dist
bun run preview                # serve o ./dist
bun run check                  # checagem de tipos e acessibilidade nos .astro
bun run novo:post "Título"     # cria src/content/blog/<slug>.md com frontmatter
bun run novo:projeto "Nome"    # idem em src/content/projetos/
```

Use **bun**, nunca npm ou pnpm.

Não há suíte de testes. A verificação é `bun run build` + `bun run check`, e ambos
precisam terminar limpos antes de qualquer commit. O build valida o frontmatter de
todo conteúdo contra o schema, então erro de conteúdo aparece aqui.

O `astro dev` do Astro 7 **roda como daemon**: ele retorna imediatamente e o servidor
fica em segundo plano. Para controlá-lo use `bunx astro dev stop|status|logs` — não
adianta procurar um processo em primeiro plano para matar.

## Astro 7 — diferenças que quebram suposições de versões anteriores

Muita documentação e memória de treino descrevem o Astro 5. Estas mudaram:

- **O processador de Markdown é o Sätteri, não unified/remark.** `markdown.remarkPlugins`,
  `rehypePlugins`, `remarkRehype` e `gfm` são API legada: usá-los exige instalar
  `@astrojs/markdown-remark` e dispara aviso de depreciação. GFM já vem ligado.
  Se precisar de transformação de Markdown, prefira fazer no `.astro` a partir de
  `post.body` (é o que a página de post faz para calcular o tempo de leitura).
- **`z` de `astro:content` está depreciado** (é Zod v3). Importe de `astro/zod` (v4).
- **`astro check` exige TypeScript 6.x.** O TS 7 ainda não expõe a API programática de
  que o language server depende, e o comando falha com erro claro. O `typescript` está
  pinado em `^6` de propósito — não atualize sem verificar isso.
- **Fonts API é nativa** (`fonts` no `astro.config.mjs`, `fontProviders`, `<Font/>` de
  `astro:assets`). Não instale `@fontsource/*`.

## Armadilhas já encontradas neste repositório

**Espaço em branco antes de tag inline.** O compilador do Astro descarta a quebra de
linha que precede uma tag inline, colando as palavras (`"no"` + `<span>próximo` vira
`nopróximo`). Ao quebrar linha antes de `<span>`, `<strong>` ou uma expressão, use
`{' '}` explícito. Isto já causou quatro bugs — confira o HTML gerado em `dist/`
quando mexer em texto com marcação no meio.

**`import.meta.url` dentro de `.astro` aponta para `dist/` no build**, não para o
caminho da fonte. Para ler arquivo do projeto (ex.: checar se `public/curriculo.pdf`
existe), use `process.cwd()`, que é a raiz do projeto. Ver `src/pages/sobre.astro`.

**`.prose` sobrescreve classes utilitárias por especificidade.** Um
`<h2 class="eyebrow">` colocado dentro de `.prose` recebe as regras de
`.prose h2` (0,1,1), que vencem `.eyebrow` (0,1,0) — a etiqueta renderizava com
26px em vez de 11px e ganhava margem de título. Só coloque dentro de `.prose` o
que é de fato texto do artigo; o resto vai fora. Nem o build nem o `astro check`
detectam isto, porque é conflito de cascata e não erro de código.

**View Transitions destroem o `<html>` e todos os elementos a cada navegação.**
Consequências, ambas já resolvidas mas fáceis de reintroduzir:
- Estado no `<html>` (o `data-theme`) precisa ser reaplicado em `astro:after-swap` —
  é a única janela entre a troca do DOM e a pintura. Ver o script `is:inline` em
  `src/layouts/Base.astro`.
- Listeners presos a um elemento morrem junto com ele. Todo script de componente usa
  **delegação no `document`**, registrada uma vez com trava de idempotência
  (`window.__nlc*Bound`). Ver `ThemeToggle.astro` e `ShareLinks.astro`.

## Arquitetura

**`src/site.config.ts` é a fonte única** de menu, serviços, princípios, canais de
contato e e-mail. Editar um serviço lá atualiza a home e `/servicos/` ao mesmo tempo.
Prefira mexer aqui a mexer no texto dentro dos `.astro`.

**Conteúdo** vive em `src/content/{blog,projetos}/*.md`, com schema em
`src/content.config.ts` (loader `glob` da Content Layer). Duas regras:
- Toda consulta a coleção **precisa** filtrar rascunho: `getCollection('blog', ({ data }) => !data.draft)`.
  Esquecer isso vaza rascunho para listagem, tags, RSS ou sitemap.
- Tags não são cadastradas em lugar nenhum — `/tags/` e `/tags/<nome>/` são geradas do
  que existe nos arquivos. Use minúsculas sem acento: a tag vira URL.

**Estilo** tem três camadas:
1. `src/styles/tokens.css` — variáveis. Os dois temas saem de uma declaração só via
   `light-dark()`, escolhida pelo `color-scheme` que o `data-theme` define.
2. `src/styles/global.css` — reset e componentes compartilhados, dentro de
   `@layer tokens, reset, base, components, utils`.
3. `<style>` dentro de cada `.astro` — escopado, e **fica fora das camadas**, portanto
   vence todas elas. É o lugar certo para estilo de uma página só.

## Regras de design que não se deduzem do código

**`--section-pad` é a única alavanca do ritmo vertical.** Ele aparece **dobrado** entre
duas seções vizinhas (padding de baixo de uma + de cima da outra). Para apertar ou
soltar a página inteira, mexa nele, não em cada seção.

**As cores da marca trocam de tom no tema claro.** `#2196F3` sobre branco dá 3,1:1,
abaixo do mínimo da WCAG. Por isso `--accent` e `--hot` têm valores diferentes por
tema, enquanto `--brand-blue` e `--brand-orange` (usados em preenchimento, onde
contraste de texto não se aplica) são fixos. Ao introduzir cor de texto, verifique o
contraste nos **dois** temas.

Isso vale também para cor que não vem de token: o gradiente do título do hero
usava `--brand-blue-lift` direto e dava **1,99:1** sobre branco, abaixo do mínimo
de 3:1 até para texto grande. Virou `--hero-from`/`--hero-to`, sensíveis ao tema.
Cor solta dentro de um `<style>` escapa da checagem que os tokens já passaram.

**Não faça gradiente de azul para laranja.** As duas são quase complementares, então
o caminho entre elas passa perto do neutro em qualquer espaço cartesiano — inclusive
oklab — e o miolo do texto sai acinzentado. Interpolar por matiz (`oklch`) elimina o
cinza mas atravessa roxo e rosa, que não existem na paleta. Onde as duas precisam
conviver, mantenha o azul no corpo e o laranja num ponto isolado.

**O laranja é raro de propósito.** Ele marca só: fim de bloco (o traço de 58° do
`.rule`), numeração de serviço, marcador de lista, item ativo do menu, o ponto
final do título do hero e a decolagem no hover dos cards. Se aparecesse em toda
divisória, deixaria de significar alguma coisa.

**Estado se mostra pela forma, não só pela cor.** O status de projeto usa um glifo
de trajetória (`StatusMark.astro`) em vez de bolinha colorida: ativo sobe e termina
aberto, concluído sobe e assenta, arquivado é linha parada. Vale como regra geral —
se um elemento distingue estados só por cor, quem não separa os matizes não lê a
informação. Antes de escolher a cor, pergunte se a forma pode carregar o significado.

**Metáfora emprestada é o que faz um elemento parecer templated.** A bolinha de
status vinha de monitoramento de servidor (no ar / fora do ar), mas estes estados
são estágio de vida, não saúde. Ao desenhar um elemento novo, cheque de onde a
metáfora vem: o vocabulário desta marca é **trajetória** — linhas que sobem, o
ângulo de 58°, níveis alcançados.

**O hover do card é só tom, de propósito.** Ele muda borda e fundo e mais nada.
Já teve uma barra de degradê no topo e, depois, um gesto de duas etapas (linha
percorrendo a base + traço decolando em 58°); ambos foram removidos por deixarem
o card ruidoso. Se for reintroduzir movimento aqui, note que ancorar a decolagem
como no `.rule` solto a joga para **baixo** do card — ela precisa nascer em
`inset-inline-start: 100%` com `transform-origin: 0 100%` e crescer para fora.
O gesto da marca hoje vive no `.rule` e no logo; o laranja do card ficou só no
`StatusMark` do projeto ativo.

**Divisórias usam `--hairline` via `border-image`**, o degradê direcional que é a
assinatura visual do site. Duas restrições técnicas:
- `border-image` **anula `border-radius`** — só use em divisória reta; caixa
  arredondada leva borda sólida.
- `border-image` **não se aplica a tabela com `border-collapse: collapse`** — por isso
  as tabelas do `.prose` usam `separate` com `border-spacing: 0`.

**Nenhum recurso de terceiro pode ser carregado.** O rodapé promete sem cookies, sem
rastreadores e sem analytics, e o site cumpre: fontes baixadas no build e servidas do
próprio domínio, e botões de compartilhar que são links comuns em vez dos widgets
oficiais (que carregariam JS das redes em toda visita). Antes de adicionar qualquer
dependência de runtime, verifique:

```bash
grep -rhoE '<(script|link|img|iframe)[^>]*(src|href)="https?://[^"]*"' dist --include="*.html" | grep -v nextlevelcode.pro
```

## Navegador para verificação visual

Esta máquina não tem Chrome nem Chromium — só Brave, ligado por symlink em
`/opt/google/chrome/chrome`, que é onde os MCPs procuram.

Use o servidor **`playwright-sandboxed`**, definido no `.mcp.json` deste
repositório. O plugin `playwright` está desabilitado aqui de propósito: ele
lança o navegador com `--no-sandbox`, e o sandbox do Chromium funciona
perfeitamente nesta máquina — o flag era desvantagem pura. Nos outros projetos
do usuário o plugin segue habilitado.

O `chrome-devtools-mcp` também funciona, mas **não consegue redimensionar** a
janela (`Restore window to normal state`). Para testar breakpoints, use o
Playwright, que lança instância própria com viewport controlável.

Vale rodar uma varredura antes de dar trabalho visual por concluído: navegar
por todas as rotas em duas larguras e dois temas verificando rolagem
horizontal, elementos estourando a viewport, `border-image` junto com
`border-radius`, e — principalmente — **palavras coladas**, que é como o espaço
descartado antes de tag inline se manifesta. Esse bug já apareceu seis vezes
neste repositório e nenhuma verificação de build o detecta.

## Git e issues

O remote é **Forgejo**, não GitHub — `gh` não funciona. Use o `tea`, já autenticado:

```bash
tea issues list -r nextlevelcode/site
tea issues create -r nextlevelcode/site -t "Título" -d "Corpo em Markdown"
```

**Abra issue para toda pendência** em vez de apenas listá-la na resposta ao usuário.
Inclua o contexto que se perde quando a sessão fecha: por que ficou pendente, do que
depende, e como verificar que está feito.
