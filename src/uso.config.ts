/**
 * Dados da página `/uso/`.
 *
 * Isto é o oposto da lista de pílulas que saiu do site: lá o nome aparecia
 * sozinho e o leitor tinha que deduzir o que ele provava. Aqui **todo item tem
 * a linha `uso`, e é ela que justifica o item existir**. Se não der para
 * escrever por que eu uso, o item não entra: nome de tecnologia sem o porquê é
 * currículo, não informação.
 *
 * A segunda diferença é o `mudancas`. Lista de ferramenta envelhece sozinha
 * porque a troca acontece em silêncio, e quem leu ano passado não tem como
 * saber o que mudou. Com o registro datado, envelhecer vira conteúdo: a pessoa
 * lê o fim da página e sabe o que é novo desde a última visita.
 *
 * Fica solto em `src/`, ao lado de `site.config.ts` e `busca.ts`, pela mesma
 * razão que eles: a árvore aqui é plana e módulo compartilhado é raro.
 */

/** De onde o programa vem. É informação de instalação, não de marca. */
export type Fonte = 'Repositório' | 'AUR' | 'Flatpak' | 'Omarchy' | 'Docker' | 'Hardware';

export interface Ferramenta {
  nome: string;
  fonte: Fonte;
  /** Por que ELA e por que EU. Uma frase, sem adjetivo de folheto. */
  uso: string;
  /** Site oficial. Link comum, nada carregado de fora (ver o CLAUDE.md). */
  url?: string;
  /**
   * Post ou projeto que conta esta ferramenta por dentro. Renderiza como link
   * no fim da linha de `uso`, e é por aqui que a referência a um texto meu
   * entra: presa ao item que ela explica, e não num bloco no rodapé da página,
   * que serve a todos e a nenhum.
   *
   * Fica opcional de propósito. Item que ganha link vira convite para ler; se
   * todos tivessem, nenhum seria. Só aponte para texto que aprofunda o motivo
   * escrito no `uso` — link de "leia mais" que repete o que já está na linha
   * gasta o clique de quem confia nele.
   */
  leitura?: { href: string; titulo: string };
}

export interface CategoriaUso {
  /** Vira âncora: minúscula, sem acento. */
  slug: string;
  titulo: string;
  /** Aparece abaixo do título, quando a categoria precisa de contexto. */
  nota?: string;
  itens: Ferramenta[];
}

/**
 * O equivalente ao "Daily Driver" da referência. Vem antes das listas porque
 * quase toda escolha adiante só faz sentido sabendo em que máquina ela roda:
 * notebook com gráfico híbrido e um servidor de 8 W explicam mais do que
 * qualquer justificativa que eu escrevesse item a item.
 */
export const maquinas = [
  {
    nome: 'Acer Nitro ANV15-51',
    papel: 'Notebook',
    detalhe:
      'Core i5 de 13ª geração, 16 GB de RAM e NVMe de 512 GB. O disco é criptografado inteiro com LUKS, então notebook perdido é notebook perdido, e não dado perdido.',
  },
  {
    nome: 'Raspberry Pi 5, 8 GB',
    papel: 'Servidor',
    detalhe:
      'Com SSD externo de 1 TB em três partições, uma delas criptografada para os dados. Gasta pouca energia, cabe na mão e é onde roda tudo da seção "O que roda em casa".',
  },
] as const;

export const categorias: CategoriaUso[] = [
  {
    slug: 'sistema',
    titulo: 'Sistema',
    itens: [
      {
        nome: 'Arch Linux',
        fonte: 'Repositório',
        uso: 'Foi por onde eu entrei em Linux e continua sendo o sistema. Nada vem instalado que eu não tenha pedido, e é isso que me obriga a entender cada peça que está ali.',
        url: 'https://archlinux.org/',
      },
      {
        nome: 'Omarchy',
        fonte: 'Omarchy',
        uso: 'Arch com Hyprland já configurado. Uso como ponto de partida em vez de montar tudo do zero de novo a cada instalação.',
        url: 'https://omarchy.org/',
      },
      {
        nome: 'Hyprland',
        fonte: 'Repositório',
        uso: 'Gerenciador de janelas em Wayland. Teclado no lugar do mouse, e a janela ocupa a tela inteira sem moldura para arrastar.',
        url: 'https://hypr.land/',
      },
      {
        nome: 'Btrfs e Snapper',
        fonte: 'Repositório',
        uso: 'Snapshot do sistema antes de mexer nele. Quando uma atualização quebra alguma coisa, eu volto no lugar de consertar às pressas.',
      },
      {
        nome: 'UFW',
        fonte: 'Repositório',
        uso: 'Firewall com regra explícita para o que entra, inclusive para as portas que o Docker publica sozinho.',
      },
    ],
  },

  {
    slug: 'terminal',
    titulo: 'Terminal',
    nota: 'É onde eu passo a maior parte do dia.',
    itens: [
      {
        nome: 'Ghostty',
        fonte: 'Repositório',
        uso: 'O terminal em si. Abre rápido e não me pede configuração para ficar utilizável.',
        url: 'https://ghostty.org/',
      },
      {
        nome: 'Bash e Starship',
        fonte: 'Repositório',
        uso: 'Shell padrão do sistema, que é o mesmo que eu vou encontrar em qualquer servidor. O Starship põe no prompt o branch e o estado do repositório.',
        url: 'https://starship.rs/',
      },
      {
        nome: 'Neovim',
        fonte: 'Repositório',
        uso: 'Editor. A configuração é versionada, então máquina nova volta a ser o meu ambiente em minutos.',
        url: 'https://neovim.io/',
      },
      {
        nome: 'tmux',
        fonte: 'Repositório',
        uso: 'Sessão que sobrevive ao fechar o terminal. É como eu trabalho em máquina remota sem perder o que ficou rodando.',
      },
      {
        nome: 'Lazygit',
        fonte: 'Repositório',
        uso: 'Git com interface no terminal: dá para preparar o commit por trecho e ler o histórico sem decorar a flag certa.',
        url: 'https://github.com/jesseduffield/lazygit',
      },
      {
        nome: 'ripgrep, fd, eza e bat',
        fonte: 'Repositório',
        uso: 'Substituem grep, find, ls e cat no uso interativo. Mesma ideia, saída legível e rápida o bastante para buscar no repositório inteiro sem pensar.',
      },
    ],
  },

  {
    slug: 'privacidade',
    titulo: 'Privacidade e segurança',
    itens: [
      {
        nome: 'Brave',
        fonte: 'AUR',
        uso: 'Navegador do dia a dia, com bloqueio de anúncio e rastreador antes de eu instalar qualquer extensão.',
        url: 'https://brave.com/',
      },
      {
        nome: 'KeePassXC',
        fonte: 'Repositório',
        uso: 'Cofre de senha em arquivo, que fica comigo. Serve para o que não pode depender de servidor nenhum estar no ar, incluindo as chaves do próprio servidor.',
        url: 'https://keepassxc.org/',
      },
      {
        nome: 'Bitwarden',
        fonte: 'Repositório',
        uso: 'O cliente que fala com o Vaultwarden que roda em casa. É o cofre do uso diário, sincronizado entre celular e notebook.',
        url: 'https://bitwarden.com/',
      },
      {
        nome: 'Tailscale',
        fonte: 'Repositório',
        uso: 'Rede privada entre as minhas máquinas. É por causa dela que nada do que roda em casa precisa ficar exposto na internet aberta.',
        url: 'https://tailscale.com/',
      },
      {
        nome: 'Proton Mail',
        fonte: 'Flatpak',
        uso: 'E-mail. É o endereço que responde quando alguém escreve pela página de contato.',
        url: 'https://proton.me/mail',
      },
    ],
  },

  {
    slug: 'casa',
    titulo: 'O que roda em casa',
    // A segunda frase daqui apontava para o projeto Self-hosted. Saiu porque o
    // item Docker, logo abaixo, já leva para lá pelo campo `leitura`, e dizer
    // duas vezes na mesma dobra gasta as duas.
    nota: 'Tudo em container no Raspberry Pi, acessível só pela Tailscale.',
    itens: [
      {
        nome: 'Docker',
        fonte: 'Docker',
        uso: 'Cada serviço abaixo é um arquivo de composição versionado. Reinstalar o servidor é subir os arquivos de novo, não repetir um tutorial.',
        url: 'https://www.docker.com/',
        leitura: { href: '/projetos/self-hosted/', titulo: 'Projeto Self-hosted' },
      },
      {
        nome: 'Nextcloud AIO',
        fonte: 'Docker',
        uso: 'Arquivo, agenda e contato sincronizados entre os aparelhos, no lugar do Google Drive.',
        url: 'https://nextcloud.com/',
        leitura: {
          href: '/blog/criando-minha-infraestrutura-digital/',
          titulo: 'Criando minha infraestrutura digital',
        },
      },
      {
        nome: 'Immich',
        fonte: 'Docker',
        uso: 'Foto e vídeo do celular sobem para casa, no lugar do Google Fotos.',
        url: 'https://immich.app/',
      },
      {
        nome: 'Vaultwarden',
        fonte: 'Docker',
        uso: 'O servidor do cofre de senha. Compatível com os aplicativos do Bitwarden, mas o banco fica no meu disco.',
        url: 'https://github.com/dani-garcia/vaultwarden',
      },
      {
        nome: 'AdGuard Home',
        fonte: 'Docker',
        uso: 'DNS da casa inteira. Anúncio e rastreador morrem antes de a página começar a carregar, em todo aparelho da rede, inclusive nos que não aceitam extensão.',
        url: 'https://adguard.com/adguard-home/overview.html',
      },
      {
        nome: 'SearXNG',
        fonte: 'Docker',
        uso: 'Busca que consulta os buscadores por mim. Nenhuma pesquisa minha fica associada a um perfil.',
        url: 'https://docs.searxng.org/',
      },
      {
        nome: 'Gluetun',
        fonte: 'Docker',
        uso: 'Todo container que precisa sair para a internet sai por dentro dele, por VPN. Se a VPN cai, o container fica sem rede em vez de vazar o endereço de casa.',
        url: 'https://github.com/qdm12/gluetun',
      },
      {
        nome: 'Forgejo',
        fonte: 'Docker',
        uso: 'Onde ficam os meus repositórios, inclusive o deste site. Issue e código no mesmo lugar, e o lugar é meu.',
        url: 'https://forgejo.org/',
      },
      {
        nome: 'RustDesk',
        fonte: 'Docker',
        uso: 'Acesso remoto com servidor próprio, no lugar do AnyDesk. É o que eu uso para atender à distância sem passar a sessão de ninguém por empresa nenhuma.',
        url: 'https://rustdesk.com/',
      },
    ],
  },

  {
    slug: 'trabalho',
    titulo: 'Para trabalhar',
    itens: [
      {
        nome: 'Astro',
        fonte: 'Repositório',
        uso: 'Gera este site. Sai HTML pronto, sem JavaScript no cliente por padrão, que é o que permite o rodapé prometer nenhum rastreador.',
        url: 'https://astro.build/',
      },
      {
        nome: 'Bun',
        fonte: 'Omarchy',
        uso: 'Instala dependência e roda os scripts do site.',
        url: 'https://bun.com/',
      },
      {
        nome: 'tea',
        fonte: 'Repositório',
        uso: 'Cliente do Forgejo no terminal. Abre e fecha issue sem abrir o navegador, e é o motivo de eu registrar pendência em vez de deixar na memória.',
        url: 'https://gitea.com/gitea/tea',
      },
      {
        nome: 'mise',
        fonte: 'Repositório',
        uso: 'Versão de linguagem por projeto. Cada repositório declara a sua e eu não fico com três versões brigando no sistema.',
        url: 'https://mise.jdx.dev/',
      },
      {
        nome: 'Claude Code',
        fonte: 'Repositório',
        uso: 'Agente no terminal, para escrever e revisar código. O que ele produz eu leio antes de aceitar: a responsabilidade pelo que entra no repositório continua minha.',
        url: 'https://claude.com/product/claude-code',
      },
    ],
  },
];

/**
 * O registro de mudanças. Item novo entra no topo, com a data do dia.
 *
 * A regra para escrever: diga o que entrou, o que saiu e **por quê**. "Troquei
 * X por Y" sem motivo não ajuda ninguém a decidir nada, e é justamente a
 * decisão que a pessoa veio buscar aqui.
 *
 * A data fica em ISO (`AAAA-MM-DD`) e a página formata. Não use `new Date()`
 * para isso: a string ISO é lida como meia-noite em UTC e, no fuso de Brasília,
 * volta um dia. A página quebra a string na mão de propósito.
 */
export const mudancas = [
  {
    data: '2026-08-05',
    texto:
      'Publicação inicial. A lista nasceu das dez pílulas que ficavam na lateral da página Sobre, onde os nomes apareciam sem dizer para que serviam.',
  },
] as const;
