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

**O `services` do `site.config.ts` é resumo, não a fonte.** A descrição completa de
cada serviço está em `docs/servicos/<slug>.md`, trazida do site Hugo que está
sendo migrado (daí a frontmatter em TOML, que aqui não serve para nada e ficou
por ser o texto original).

Antes de escrever ou editar `summary`, `points` ou `tools`, **leia o arquivo
correspondente**. O que está no `site.config.ts` é uma condensação, e mais de uma
vez o resumo já prometeu coisa que o serviço real não faz. Os nomes lá são mais
longos que os do site novo: "Suporte Técnico e Soluções em Tecnologia",
"Segurança e Privacidade Digital", "Desenvolvimento Web e Soluções Sob Medida".

O que não se deduz do `site.config.ts` sozinho:

- **O público é pessoa física e pequeno negócio.** Não é time de infraestrutura.
  Todo texto de serviço se escreve para quem descreve o problema como "tela azul",
  não como "falha de kernel".
- **Segurança é educativo e preventivo, e o escopo é fechado por escrito.** O
  arquivo exclui, com todas as letras, **teste de invasão, perícia digital,
  recuperação de contas e investigação forense**. Nunca acrescente esses itens,
  nem os deixe comentados esperando por um dia — comentário parece pendência e
  alguém reativa.
- **Suporte é centrado em notebook e inclui trabalho físico**: limpeza interna,
  ventilação, pasta térmica, dobradiça. Também remoção de malware, upgrade de SSD
  e RAM, e orientação de compra.
- **Automação é metade do serviço de web**, não um extra: tarefa repetitiva,
  integração entre sistemas, redução de retrabalho.
- **O atendimento é presencial ou remoto**, e no suporte pode envolver recolher o
  equipamento mediante agendamento, sempre autorizado antes. Isso está nos
  arquivos do Hugo e **ainda não aparece em lugar nenhum do site novo** — é a
  informação que falta para quem está com a máquina quebrada decidir chamar.

**Conteúdo** vive em `src/content/{blog,projetos}/*.md`, com schema em
`src/content.config.ts` (loader `glob` da Content Layer). Duas regras:
- Toda consulta a coleção **precisa** filtrar rascunho: `getCollection('blog', ({ data }) => !data.draft)`.
  Esquecer isso vaza rascunho para listagem, tags, RSS ou sitemap.
- Tags não são cadastradas em lugar nenhum — `/tags/` e `/tags/<nome>/` são geradas do
  que existe nos arquivos. Use minúsculas sem acento: a tag vira URL.

**Busca** (`/busca/`, ícone de lupa no cabeçalho) roda inteira no navegador. São três
peças: `src/busca.ts` monta o índice no build, `src/pages/busca.json.ts` o serve como
`/busca.json`, e `src/pages/busca.astro` baixa esse arquivo e filtra. Nenhuma
requisição sai do domínio, e nada do que é pesquisado é registrado.

- **Conteúdo novo precisa entrar em `src/busca.ts`.** Post, projeto e tag entram
  sozinhos, porque vêm das coleções. Serviço vem do `site.config.ts`. **Página
  institucional é escrita à mão lá** — uma página nova não aparece na busca até
  ganhar sua entrada. O filtro de rascunho vale aqui como em qualquer listagem.
- O texto das páginas institucionais no índice **não é cópia** da `<meta
  description>` delas: é a frase que se lê numa lista de resultados. As duas podem
  divergir sem que nada quebre.
- O índice guarda o corpo inteiro dos posts (é o que faz achar uma palavra no meio
  de um parágrafo), então ele cresce com o blog. Por isso é arquivo separado e não
  dado embutido na página: só quem abre a busca paga esse peso.
- `src/busca.ts` fica solto em `src/`, ao lado de `site.config.ts` e
  `content.config.ts`: módulo compartilhado é raro aqui e a árvore é plana.

**`/uso/`** (dados em `src/uso.config.ts`) é a página de "o que eu uso": máquina,
sistema, programas e os serviços que rodam no Raspberry Pi. Três regras, e as três
são o motivo de ela existir depois que as listas de ferramentas saíram (#22):

- **Item sem a linha `uso` não entra.** O campo não é descrição da ferramenta, é
  por que ela está *nesta* máquina. Sem ele, volta a ser a pílula que foi removida.
- **Mudança na lista pede linha em `mudancas`**, com data e motivo. É o que faz a
  página envelhecer por escrito em vez de em silêncio, e o "atualizado em" do topo
  sai da data mais recente. A data é string ISO formatada na mão: `new Date('…')`
  lê meia-noite em UTC e volta um dia no fuso de Brasília.
- **Referência a post ou projeto entra pelo campo `leitura` do item**, que vira link
  no fim da linha de `uso`. Não crie bloco de "veja também" no fim da página: ele
  serve a trinta itens e a nenhum, e chega depois que a pessoa terminou de ler.
  O campo é opcional porque item com link é convite; se todos tivessem, nenhum seria.
- **A página fica fora do `nav`.** O menu é caminho de cliente, e o público desta
  página é quem lê o blog. Ela é alcançada pela `/sobre/`, pela busca e por link
  direto. Pôr no menu ainda esbarra na issue #13 (nav não cabe a 390px).
  Por isso a trilha (`Breadcrumb.astro`) dela aponta para a `/sobre/` e não para
  a raiz: fora do menu, a `/sobre/` é a única entrada que existe aqui dentro, e
  devolver a pessoa para a home a faria procurar de novo por uma página que o
  menu não tem. Como a URL é `/uso/` e não `/sobre/uso/`, o botão sai como
  `cd ~/sobre` em vez de `cd ..` — o componente compara a URL com o pai e só
  escreve `cd ..` quando o pai é mesmo o diretório acima.

O `texto` dela no índice da busca é gerado do próprio `uso.config.ts`, e não escrito
à mão como o das outras páginas institucionais: quem procura digita `immich`, não
"uso". Item novo entra na busca junto com a página.

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

## Regras de escrita do texto de marketing

Todas saíram de texto que já esteve publicado neste site e foi trocado. Valem para
`site.config.ts`, para as páginas institucionais e para `<meta description>` — não
para os posts do blog, que são voz do autor.

**Não pressuponha falta em quem lê.** "Não precisa saber o termo técnico certo"
supõe que a pessoa não sabe; "descreva com suas palavras" supõe que as palavras
dela não seriam as certas. Tranquilizar sobre algo que ninguém levantou avisa que
você esperava o pior. Quando a informação for necessária, **mude de quem é a
falta**: em vez de "você não precisa saber", "o que eu precisar saber, eu pergunto".

**Não invente adversário.** "Sem vender medo" só faz sentido se existir alguém
vendendo medo, então a frase insere esse alguém na cabeça do leitor e passa a
falar do concorrente em vez de falar de você. O filtro: **se a negativa não te
limita, ela é retórica**. "Nada que te prenda a um fornecedor, inclusive a mim"
custa alguma coisa a você e por isso vale; "sem vender medo" cobra de um terceiro
imaginário e não obriga a nada.

**Adjetivo grátis não é argumento.** "Personalizado", "completo", "de alta
performance", "melhores ferramentas", "diagnóstico honesto" — ninguém anuncia
diagnóstico incompleto nem ferramenta ruim. Se dizer o contrário for absurdo, o
adjetivo não informa. Prefira o fato que o sustenta, ou corte.

**Sintoma antes de categoria.** O cliente reconhece "tela azul", "travando",
"não liga"; não reconhece "falhas de sistema" nem "necessidade de manutenção".
Uma lista de sintomas precisa ser toda do mesmo tipo — misturar dois sintomas com
uma atividade ("travamento, tela azul, manutenção") quebra a leitura.

**Toda frase precisa de um dono.** "Soluções para X" e "Suporte para X" nomeiam a
categoria e não prometem nada; ninguém pode ser cobrado por ter oferecido soluções.
Primeira pessoa **do singular**, sempre: um "nós" num negócio de uma pessoa é o
truque de parecer maior, e contradiz o resto da página.

**Não troque de sujeito no meio da frase.** "Travamento, problema de sistema ou
peça com defeito: seu computador volta a funcionar" obriga o leitor a voltar e
reatribuir os três problemas a um sujeito que só apareceu no fim.

**Título nomeia a ação, não a virtude.** Quem anuncia a própria honestidade está
pedindo para acreditarem nele. "Diagnóstico honesto" virou "Digo quando não
compensa": o corpo do texto já demonstrava, o título só afirmava.

**Cada promessa aparece uma vez.** A mesma frase sobre diagnóstico honesto já
esteve em três lugares na jornada de um clique. Divisão atual, e há comentário nos
arquivos explicando cada uma:

| onde | trabalho |
|---|---|
| CTA da home | diz o que a pessoa recebe de volta, e promete o diagnóstico honesto |
| `/servicos/`, bloco `.closing` | promete orçamento fechado antes de começar |
| `/contato/` | diz como escrever |
| `/sobre/` | conta quem escreve e o que o move. **Não carrega promessa nenhuma.** |

A `/sobre/` já prometeu portabilidade ("nada do que eu faço fica preso comigo").
A frase saiu na reescrita da página, por decisão do autor, e **não volta**: não
foi esquecimento nem efeito colateral. Não a recoloque, ali nem em outra página.

**O texto da `/sobre/` é do autor, na voz dele.** Ao editar aquele bloco, corrija
ortografia e pontuação e nada mais: a página vale pela sinceridade, e frase polida
por terceiro soa como todas as outras. As regras de escrita acima valem para o
resto do texto institucional, não para ali.

A home já teve uma dobra só de compromissos, com as três promessas lado a lado.
Ela saiu: promessa empilhada com o mesmo peso das seções de conteúdo vira
desconto automático de quem não conhece o autor, e nenhuma das três ficava perto
de onde a decisão acontece. **Promessa rende onde a pessoa hesita; aquela dobra
rende no dia em que houver caso real com resultado para colocar nela.**

**Sem travessão no texto institucional.** Onde ele anunciava explicação, use
dois-pontos; onde era pausa, vírgula. Sobra travessão só em separador de campo
(`<title>`, `aria-label`, título do feed), que não é retórica. Os posts do blog
ficam de fora desta regra.

## Navegador para verificação visual

**O caminho que funciona em qualquer máquina é o driver de
`.claude/skills/run-site/`**: ele fala CDP direto, roda headless e aceita
`BROWSER_BIN=/caminho/do/binario`. Numa VM sem interface gráfica é a única
opção, porque os MCPs de navegador procuram um caminho fixo de Chrome e não
leem essa variável.

Onde houver ambiente gráfico e o binário estiver onde os MCPs esperam, o
servidor **`playwright-sandboxed`** do `.mcp.json` deste repositório também
serve. O plugin `playwright` está desabilitado aqui de propósito: ele lança o
navegador com `--no-sandbox`, e o sandbox do Chromium funciona — o flag era
desvantagem pura. Nos outros projetos do usuário o plugin segue habilitado.

O `chrome-devtools-mcp` funciona, mas **não consegue redimensionar** a janela
(`Restore window to normal state`). Para testar breakpoints, use o Playwright ou
o driver, que controlam a viewport.

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
