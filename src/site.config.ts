/**
 * Fonte única de verdade para textos e links que aparecem em várias páginas.
 * Editar aqui muda o site inteiro — nada de caçar string em 10 arquivos.
 */

export const site = {
  name: 'NextLevelCode',
  tagline: 'Tecnologia com liberdade, privacidade e segurança.',
  description: 'Blog e projetos sobre Linux, homelab, privacidade e segurança.',
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
  { href: '/projetos/', label: 'Projetos' },
  { href: '/blog/', label: 'Blog' },
  { href: '/sobre/', label: 'Sobre' },
] as const;

/*
 * Aqui moravam os três serviços (suporte, segurança, web), lidos pela home,
 * pela /servicos/ e pelo índice da busca. O site deixou de ser vitrine de
 * atendimento e virou blog e projetos: a página saiu, o item do menu saiu e
 * este array saiu junto.
 *
 * O texto completo de cada um continua em `docs/servicos/*.md`, trazido do
 * site Hugo. Aqueles arquivos ficam no repositório como registro, fora do
 * build: nada em `src/` os lê.
 *
 * Junto foram embora dois campos que só existiam por causa deles: `tools`,
 * com os nomes de software que viravam pílulas, e `commitments`, com as três
 * promessas que a home exibia numa dobra própria. O git guarda os três.
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
