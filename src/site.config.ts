/**
 * Fonte única de verdade para textos e links que aparecem em várias páginas.
 * Editar aqui muda o site inteiro — nada de caçar string em 10 arquivos.
 */

export const site = {
  name: 'NextLevelCode',
  tagline: 'Tecnologia com liberdade, privacidade e segurança.',
  description:
    'Suporte técnico, segurança da informação e desenvolvimento web para quem leva infraestrutura a sério. Soluções abertas, privadas e sob seu controle.',
  author: 'NextLevelCode',
  email: 'work@nextlevelcode.pro',
  locale: 'pt-BR',
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
      'Manutenção, recuperação e configuração de máquinas e redes — sem enrolação e sem software que te espiona.',
    points: [
      'Diagnóstico e reparo de hardware (desktop, notebook, servidor)',
      'Instalação e migração para Linux',
      'Recuperação de dados e estratégia de backup 3-2-1',
      'Redes domésticas e de pequenas empresas',
      'Homelab: virtualização, containers e self-hosting',
    ],
  },
  {
    slug: 'seguranca',
    number: '02',
    title: 'Segurança da Informação',
    summary:
      'Descobrir o que está exposto antes que alguém descubra por você — e fechar a porta com o mínimo de atrito.',
    points: [
      'Avaliação de superfície de ataque e hardening',
      'Testes de intrusão autorizados em aplicações web',
      'Gestão de senhas, 2FA e chaves de criptografia',
      'Resposta a incidentes e análise pós-invasão',
      'Treinamento prático de higiene digital para equipes',
    ],
  },
  {
    slug: 'web',
    number: '03',
    title: 'Desenvolvimento Web',
    summary:
      'Sites rápidos, acessíveis e sem rastreadores. Você é dono do código e dos dados — não uma plataforma.',
    points: [
      'Sites institucionais e landing pages de alta performance',
      'Blogs e documentação em Markdown',
      'Integrações e automações sob medida',
      'Analytics respeitoso, sem cookies de terceiros',
      'Deploy, domínio, TLS e monitoramento',
    ],
  },
] as const;

export const principles = [
  {
    title: 'Liberdade',
    body: 'Software livre e padrões abertos sempre que possível. Nada que te prenda a um fornecedor — inclusive a mim.',
  },
  {
    title: 'Privacidade',
    body: 'Coletar o mínimo, guardar o mínimo. Se um dado não precisa existir, ele não é criado.',
  },
  {
    title: 'Segurança',
    body: 'Padrão seguro por definição, não como configuração opcional que alguém esquece de ligar.',
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
    note: 'Meus repositórios, auto-hospedados.',
  },
  {
    label: 'GitHub',
    href: 'https://github.com/nextlevelcode',
    note: 'Espelho público e contribuições.',
  },
  {
    label: 'Substack',
    href: 'https://substack.com/@nextlevelcode',
    note: 'Newsletter — textos mais longos e menos técnicos.',
  },
  {
    label: 'E-mail',
    href: `mailto:${site.email}`,
    note: 'Melhor canal. Respondo em até 1 dia útil.',
  },
  {
    label: 'RSS',
    href: '/rss.xml',
    note: 'O blog no seu leitor, sem depender de algoritmo.',
  },
] as const;
