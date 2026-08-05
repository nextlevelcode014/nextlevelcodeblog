/**
 * Fonte única de verdade para textos e links que aparecem em várias páginas.
 * Editar aqui muda o site inteiro — nada de caçar string em 10 arquivos.
 */

export const site = {
  name: 'NextLevelCode',
  tagline: 'Tecnologia com liberdade, privacidade e segurança.',
  description:
    'Suporte técnico, segurança da informação e desenvolvimento web.',
  author: 'NextLevelCode',
  email: 'work@nextlevelcode.pro',
  locale: 'pt-BR',
} as const;

/*
 * Citação do rodapé. Fica fora do `site` de propósito: o `tagline` alimenta o
 * `<title>` da home (`Base.astro`), onde texto longo é cortado pela busca em
 * ~60 caracteres. Este campo tem um consumidor só, o `Footer.astro`, e é
 * marcado como `<blockquote>` para que a voz do Herbert não se confunda com a
 * voz do site em leitor de tela.
 */
export const quote = {
  text: 'Antigamente, os homens entregaram seu pensamento às máquinas, na esperança de que isso os libertasse. Mas isso apenas permitiu que outros homens, com suas máquinas, os escravizassem.',
  author: 'Frank Herbert',
  work: 'Duna',
} as const;

export const nav = [
  { href: '/', label: 'Início' },
  { href: '/servicos/', label: 'Serviços' },
  { href: '/projetos/', label: 'Projetos' },
  { href: '/blog/', label: 'Blog' },
  { href: '/sobre/', label: 'Sobre' },
] as const;

export const services = [
  {
    slug: 'suporte',
    number: '01',
    title: 'Suporte Técnico',
    summary:
      'Está com o computador travando, dando tela azul ou com algum defeito? Eu conserto.',
    // Oito itens, e a ordem importa: em /servicos/ a lista vira duas colunas
    // preenchidas por coluna, então os quatro primeiros ficam à esquerda
    // (sistema e desempenho) e os quatro últimos à direita (peça, rede e
    // máquina ligada). Ao mexer aqui, mantenha o número par.
    points: [
      'Diagnóstico completo de hardware e software',
      'Instalação e configuração de Windows e Linux',
      'Recuperação e otimização de desempenho',
      'Remoção de malware e programas indesejados',
      'Limpeza interna e manutenção preventiva',
      'Configuração de redes, periféricos e backups',
      'Instalação e manutenção de servidores',
      'Compra e troca de peças',
    ],
  },
  {
    slug: 'seguranca',
    number: '02',
    title: 'Segurança da Informação',
    summary:
      'Usa a mesma senha em vários sites e nunca fez backup? Eu organizo e te mostro como manter.',
    // Todos os itens são sintagma nominal, como nos outros dois serviços. Os
    // três últimos já foram oração ("Como identificar...", "O que fazer..."),
    // o que separava o que eu configuro do que eu ensino — distinção que o
    // `summary` já carrega e que a lista chapada da /servicos/ não mostrava.
    // Teste de intrusão não entra aqui: o arquivo do Hugo exclui por escrito.
    points: [
      'Estratégia de backup 3-2-1, configurada e testada',
      'Gerenciador de senhas e verificação em duas etapas',
      'Ajuste das configurações de privacidade em redes sociais',
      'Controle de permissões de aplicativos no celular',
      'Redução de rastreamento em navegadores e serviços online',
      'Identificação de phishing, golpe e engenharia social',
      'Cuidados com links, anexos e downloads',
      'Procedimentos em caso de suspeita de invasão ou vazamento',
    ],
  },
  {
    slug: 'web',
    number: '03',
    title: 'Desenvolvimento Web',
    summary:
      'Precisa de um site rápido ou de um sistema feito para o seu caso? Eu construo, e o código fica com você.',
    // Mesma divisão em duas colunas do serviço 01: os quatro primeiros são o
    // que se constrói, os quatro últimos o que roda depois de pronto.
    // Automação é metade deste serviço, e não um extra — por isso "tarefas
    // repetitivas" tem item próprio, e o item de integração, que antes dizia
    // "integrações e automações", ficou só com integração para não repetir.
    //
    // Havia aqui um "Analytics respeitoso, sem cookies de terceiros". Saiu por
    // um motivo de página, não de princípio: o rodapé promete "sem analytics",
    // e ler as duas frases no mesmo scroll obriga o leitor a escolher em qual
    // acreditar. Medição e cookie não são ruins por natureza, e o serviço faz
    // isso para cliente que precisar, com política respeitosa. Se voltar, o
    // texto precisa deixar claro que é escolha do projeto do cliente, não o
    // que roda aqui.
    points: [
      'Sites institucionais e landing pages',
      'Blogs e documentação em Markdown',
      'Painéis administrativos e áreas restritas',
      'Formulários, cadastros e gestão de informações',
      'Automação de tarefas repetitivas',
      'Integrações entre sistemas e serviços',
      'Coleta e organização de dados',
      'Deploy, domínio, TLS e monitoramento',
    ],
  },
] as const;

/*
 * Cada serviço tinha aqui um `tools`, com os nomes de software que apareciam
 * como pílulas na home e na /servicos/. O campo saiu inteiro junto com as duas
 * listagens: sem ninguém que renderize, dado em config vira enfeite que um dia
 * alguém volta a exibir só porque já estava aqui. O git guarda as listas; o
 * comentário em `src/pages/servicos.astro` guarda o motivo de terem saído.
 */

/*
 * Havia aqui um `commitments`, renderizado como dobra própria na home. Ele
 * saiu: três promessas com o mesmo peso de Serviços e Projetos viram desconto
 * automático de quem ainda não conhece o autor, e nenhuma ficava perto de onde
 * a decisão acontece. O comentário na home explica em detalhe.
 *
 * Os textos que sobraram moram cada um no contexto que ocupa, e por isso não
 * moram mais aqui: nenhum é compartilhado entre páginas.
 *
 * - preço antes do trabalho ....... `src/pages/servicos.astro`, bloco .closing
 * - digo quando não compensa ...... `src/pages/index.astro`, .cta__body
 *
 * O terceiro, "nada fica preso comigo", saiu do site na reescrita da /sobre/,
 * por decisão do autor. Não é pendência e não volta.
 */

export const principles = [
  {
    title: 'Liberdade',
    body: 'Sua ferramenta, seu direito de estudar, modificar, distribuir, copiar e usar.',
  },
  {
    title: 'Transparência',
    body: 'Não confie, verifique. Se não é verificável, não é seguro: é esperança.',
  },
  {
    title: 'Privacidade',
    body: 'Poder de revelar-se seletivamente ao mundo.',
  },
  {
    title: 'Segurança',
    body: 'Processo contínuo de redução de risco e de reação.',
  },
] as const;

/**
 * Canais de contato e presença. `note` é a descrição usada na página /contato/.
 *
 * O Forgejo usa um endereço `*.ts.net` exposto via Tailscale Funnel — ou seja,
 * é público apesar de parecer interno. Se o Funnel for desligado um dia, o
 * link para de resolver para quem está fora da tailnet e precisa sair daqui.
 */
export const socials = [
  {
    label: 'Forgejo',
    href: 'https://forgejo.tail181a66.ts.net',
    note: 'Meus repositórios, self-hosted.',
  },
  {
    label: 'GitHub',
    href: 'https://github.com/nextlevelcode',
    note: 'Espelho público e contribuições.',
  },
  {
    label: 'Substack',
    href: 'https://substack.com/@nextlevelcode',
    note: 'Newsletter com textos mais longos e menos técnicos.',
  },
  {
    label: 'E-mail',
    href: `mailto:${site.email}`,
    note: 'Melhor canal. Respondo em até 1 dia.',
  },
  {
    label: 'RSS',
    href: '/rss.xml',
    note: 'Feed RSS.',
  },
] as const;
