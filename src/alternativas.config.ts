/**
 * Dados da página `/alternativas/`.
 *
 * Ela responde "de onde eu vim", que é pergunta de quem já usa o serviço da
 * coluna de cima e veio ver o que existe no lugar dele.
 *
 * **Só entra troca que aconteceu.** Ferramenta que não substituiu nada fica de
 * fora: forçar um par para Astro, Bun ou mise inventaria um adversário que não
 * existe, que é o defeito que as regras de escrita do `CLAUDE.md` mandam
 * evitar. É essa regra que separa esta página de um diretório de recomendação,
 * onde encher categoria exige inventar par. Por isso ela é curta, e por isso
 * ela não cresce sozinha: cresce quando eu troco de ferramenta de verdade.
 *
 * Fica solto em `src/`, ao lado de `site.config.ts` e `busca.ts`, pela mesma
 * razão que eles: a árvore aqui é plana.
 */

export interface Ferramenta {
  nome: string;
  /**
   * Site oficial. Só a alternativa ganha link: quem chega aqui já conhece o
   * serviço da esquerda, e mandar tráfego para ele não é o que esta página
   * faz. Link comum, nada carregado de fora (ver o CLAUDE.md).
   */
  url: string;
  /**
   * Slug da marca em `icones.ts`. Opcional porque nem toda ferramenta é uma
   * marca com logo, e nem todo dono publica vetor. Sem o slug, a página põe uma
   * caixa vazia tracejada no mesmo espaço (ver `IconeMarca.astro`), então o
   * alinhamento das colunas não depende de todo item ter desenho.
   */
  icone?: string;
  /**
   * Comentário de uma linha só, colado no fim dela como `# texto`.
   *
   * Existe para a linha que mente por omissão sem uma frase ao lado, e cuja
   * correção não cabe no nome nem na categoria: o Android é contexto porque
   * GrapheneOS e LineageOS **são** Android, e sem isso escrito a linha parece
   * incoerente com as outras. É o mesmo motivo pelo qual arquivo de
   * configuração ganha comentário, e os dois arquivos que esta página compara
   * (`o-que-eu-usava` e `o-que-eu-uso`) são isso: o `#` já vinha com o
   * significado pronto, não precisou ser inventado.
   *
   * Use pouco, e só onde a página estaria errada sem a nota. Comentário em
   * toda linha vira legenda, e legenda é justamente o que sumiu quando os
   * cards viraram `diff`. Não entra no diffstat, porque comentário não é
   * linha inserida nem removida.
   *
   * Frase curta, em minúscula e sem ponto final: é comentário de arquivo, não
   * período de texto.
   */
  nota?: string;
}

/**
 * Marca citada sem link: o que saiu (`de`) e o que ficou (`contexto`). Não é
 * `Ferramenta` porque não tem `url`, e essa é a diferença que importa: link é
 * da alternativa, e mandar tráfego para o que eu não recomendo seria o
 * contrário do que a página faz.
 */
export interface Marca {
  nome: string;
  /** Slug da marca em `icones.ts`, com a mesma regra do `icone`. */
  icone?: string;
  /** Comentário de linha, com a mesma regra do `nota` de `Ferramenta`. */
  nota?: string;
}

export interface Alternativa {
  /** O assunto da troca, não o nome do produto: "Fotos", não "Immich". */
  categoria: string;
  /**
   * O que eu usava. Nome literal do serviço, sem juízo de valor colado.
   *
   * Opcional porque em algumas categorias eu nunca cheguei a usar o serviço
   * que quase todo mundo usa: entrei direto na alternativa. A linha aparece
   * sem o `-`, que é saída legítima de `diff` (trecho só de adição), e o
   * diffstat não conta uma remoção que não houve.
   *
   * Isso **não** abre a porta para ferramenta que não substitui nada. O que
   * segura a linha de pé é a categoria: do outro lado dela existe um serviço
   * que o leitor conhece e que ela ocupa o lugar. Sem isso, a lista vira
   * catálogo de preferências, que é a página que o autor tirou do ar.
   *
   * É lista pela mesma razão que `para` e `contexto` são: a saída nem sempre
   * é de um serviço só. De streaming saíram dois, e generalizar para
   * "serviços de streaming" trocaria dois nomes que o leitor reconhece por uma
   * categoria que não diz nada (ver as regras de escrita do `CLAUDE.md`).
   */
  de?: Marca[];
  /**
   * O que continua em uso, apesar de tudo: a alternativa entrou ao lado disto,
   * não no lugar disto.
   *
   * A linha entra sem sinal nenhum e vira **linha de contexto** do `diff`, que
   * num `diff -u` de verdade significa "existe nos dois arquivos". Aqui os
   * arquivos são `o-que-eu-usava` e `o-que-eu-uso`, então o sinal certo já
   * existia no formato e não precisou ser inventado. O diffstat não conta
   * contexto nem como inserção nem como remoção, pela mesma razão que o `diff`
   * não conta.
   *
   * Isto é confissão, não meia-vitória: dizer `- WhatsApp` com o WhatsApp
   * ainda instalado seria a página mentindo para parecer mais coerente do que a
   * vida é. Use só onde a saída não aconteceu **e** não depende só de você.
   *
   * É lista porque numa mesma categoria pode sobrar mais de um: em rede social
   * sobraram três, e escolher um deles para caber no desenho esconderia
   * justamente o tamanho do que não saiu.
   */
  contexto?: Marca[];
  /**
   * O que ficou no lugar. É lista porque a substituição real nem sempre é um
   * para um: o que saiu do YouTube foi para dois aplicativos, e escolher um
   * deles para caber no desenho seria mentir sobre o que eu uso.
   *
   * **A ordem importa: a primeira é a que eu mais uso.** A página não numera
   * nem rotula "principal", mas lê de cima para baixo, então quem bater o olho
   * pega a primeira. Ordenar por gosto e não por acaso é o que faz a lista
   * responder "o que eu ponho no lugar" em vez de "o que existe".
   *
   * Pode ficar **vazia**, e aí a categoria é só `contexto`: eu dependo daquilo
   * e não achei o que pôr no lugar. É o caso do registrador de domínio. Vazia
   * ela não some da página, porque a dependência existe mesmo sem resposta.
   */
  para: Ferramenta[];
}

/**
 * Os pares, na ordem em que aparecem na página.
 *
 * A ordem não é cronológica nem alfabética: é a do peso que a troca teve no
 * dia a dia. Quem lê de cima para baixo encontra primeiro o que substitui um
 * serviço que quase todo mundo usa, e a página se explica sem precisar de
 * legenda.
 */
export const alternativas: Alternativa[] = [
  {
    categoria: 'E-mail',
    contexto: [{ nome: 'Gmail', icone: 'gmail', nota: 'Tuta Mail é outra boa opção' }],
    para: [{ nome: 'Proton Mail', url: 'https://proton.me/mail', icone: 'protonmail' }],
  },
  {
    categoria: 'Mensagens',
    contexto: [{ nome: 'WhatsApp', icone: 'whatsapp' }],
    para: [
      { nome: 'Element (Matrix)', url: 'https://element.io', icone: 'element' },
      // { nome: 'Signal', url: 'https://signal.org/', icone: 'signal' },
      { nome: 'Nextcloud Talk', url: 'https://nextcloud.com/talk/', icone: 'nextcloud' },
    ],
  },
  {
    categoria: 'Navegador',
    de: [{ nome: 'Chrome', icone: 'googlechrome' }],
    para: [
      { nome: 'Zen Browser', url: 'https://zen-browser.app/', icone: 'zenbrowser', nota: 'goat' },
      { nome: 'Brave Origin', url: 'https://brave.com/origin/', icone: 'brave', nota: 'no caso de precisar de alguma funcionalidade do Chrome' },
      { nome: 'DuckDuckGo', url: 'https://duckduckgo.com/browser', icone: 'duckduckgo', nota: 'recomendo para usar no Windows' },
    ],
  },
  {
    categoria: 'Busca',
    de: [{ nome: 'Google', icone: 'google' }],
    para: [
      // O "(self-hospedado)" entra no nome porque é o que distingue esta linha
      // das outras duas: as duas de baixo são serviço de terceiro, e esta roda
      // no Raspberry Pi. Sem a marca, quem lê supõe searx.be e a troca perde o
      // que ela tem de diferente.
      { nome: 'SearXNG (self-hospedado)', url: 'https://docs.searxng.org/', icone: 'searxng' },
      { nome: 'Brave Search', url: 'https://search.brave.com/', icone: 'brave' },
      { nome: 'DuckDuckGo', url: 'https://duckduckgo.com/', icone: 'duckduckgo' },
    ],
  },
  {
    categoria: 'Armazenamento',
    de: [{ nome: 'Google Drive', icone: 'googledrive' }],
    para: [{ nome: 'Nextcloud AIO', url: 'https://nextcloud.com/', icone: 'nextcloud', nota: 'simplesmente incrível' }],
  },
  {
    categoria: 'Fotos',
    de: [{ nome: 'Google Fotos', icone: 'googlephotos' }],
    para: [{ nome: 'Immich', url: 'https://immich.app/', icone: 'immich' }],
  },
  {
    categoria: 'Vídeo',
    de: [{ nome: 'YouTube', icone: 'youtube' }],
    para: [
      { nome: 'Grayjay', url: 'https://grayjay.app/', icone: 'grayjay' },
      { nome: 'Flow', url: 'https://flow.aedev.me/', icone: 'flow' },
    ],
  },
  {
    // Só o Jellyfin, que é onde eu assisto. Sonarr, Radarr, Prowlarr,
    // Jellyseerr, Bazarr, Profilarr, Decluttarr, Dozzle e o qBittorrent rodam
    // junto no mesmo compose, mas são como o filme chega lá: engrenagem da
    // stack, não resposta à pergunta "o que eu ponho no lugar da Netflix".
    categoria: 'Streaming',
    de: [{ nome: 'Netflix', icone: 'netflix' }, { nome: 'Prime Video' }],
    para: [{ nome: 'Jellyfin', url: 'https://jellyfin.org/', icone: 'jellyfin' }],
  },
  {
    categoria: 'Senhas',
    para: [
      { nome: 'Bitwarden', url: 'https://bitwarden.com/', icone: 'bitwarden' },
      { nome: 'KeePassXC', url: 'https://keepassxc.org/', icone: 'keepassxc' },
    ],
  },
  {
    categoria: 'Dois fatores',
    para: [{ nome: 'Ente Auth', url: 'https://ente.io/auth', icone: 'ente' }],
  },
  {
    categoria: 'Agenda',
    de: [{ nome: 'Google Agenda', icone: 'googlecalendar' }],
    para: [
      {
        nome: 'Nextcloud Calendar',
        url: 'https://apps.nextcloud.com/apps/calendar',
        icone: 'nextcloud',
      },
    ],
  },
  {
    // Genérico dos dois lados de propósito: Google e Fossify têm a suíte
    // inteira (contatos, galeria, arquivos, telefone), e nomear só um app
    // faria a linha prometer menos do que a troca foi.
    categoria: 'Apps do sistema',
    de: [{ nome: 'Apps do Google', icone: 'google' }],
    para: [{ nome: 'Fossify', url: 'https://www.fossify.org/', icone: 'fossify' }],
  },
  {
    categoria: 'Notas',
    de: [{ nome: 'Google Keep', icone: 'googlekeep' }],
    para: [
      { nome: 'Nextcloud Notes', url: 'https://apps.nextcloud.com/apps/notes', icone: 'nextcloud' },
    ],
  },
  {
    categoria: 'Escritório',
    para: [
      { nome: 'Proton Docs', url: 'https://proton.me/drive/docs', icone: 'proton' },
      { nome: 'LibreOffice', url: 'https://www.libreoffice.org/', icone: 'libreoffice' },
    ],
  },
  {
    categoria: 'Videochamada',
    de: [{ nome: 'Discord', icone: 'discord' }],
    para: [{ nome: 'Nextcloud Talk', url: 'https://nextcloud.com/talk/', icone: 'nextcloud' }],
  },
  {
    categoria: 'Mapas',
    de: [{ nome: 'Google Maps', icone: 'googlemaps' }],
    para: [{ nome: 'Organic Maps', url: 'https://organicmaps.app/', icone: 'organicmaps' }],
  },
  {
    // A única categoria sem nenhuma remoção: as três de cima continuam
    // instaladas e o Nostr entrou ao lado delas. É a linha mais honesta da
    // página, e a que mais custa: rede social não se abandona sozinho, porque
    // o que prende não é o aplicativo, são as pessoas que estão nele.
    categoria: 'Rede social',
    contexto: [
      { nome: 'Instagram', icone: 'instagram' },
      { nome: 'Reddit', icone: 'reddit' },
      { nome: 'Substack', icone: 'substack' },
    ],
    para: [{ nome: 'Nostr', url: 'https://nostr.com/' }],
  },
  {
    categoria: 'Assistente de IA',
    de: [{ nome: 'ChatGPT', icone: 'openai' }],
    contexto: [{ nome: 'Claude', icone: 'claude' }],
    para: [
      { nome: 'Brave Leo', url: 'https://brave.com/leo/', icone: 'brave' },
      // O ícone é o da Proton: o Lumo não tem marca própria no Simple Icons, e
      // é a Proton que responde por ele, como no Proton Docs logo acima.
      { nome: 'Lumo', url: 'https://proton.me/lumo', icone: 'proton' },
      // "(self-hospedado)" pela mesma razão da linha da Busca: sem a marca,
      // Ollama ao lado de dois serviços de terceiro se lê como mais um deles,
      // e o que ele tem de diferente é justamente rodar aqui.
      { nome: 'Ollama (self-hospedado)', url: 'https://ollama.com/', icone: 'ollama' },
    ],
  },
  {
    categoria: 'VPN',
    para: [{ nome: 'Proton VPN', url: 'https://protonvpn.com/', icone: 'protonvpn' }],
  },
  {
    categoria: 'DNS',
    para: [
      {
        nome: 'AdGuard Home',
        url: 'https://adguard.com/adguard-home/overview.html',
        icone: 'adguard',
      },
    ],
  },
  {
    categoria: 'Sistema do celular',
    // Contexto e não remoção porque os dois de baixo são Android: o que saiu
    // foi o Android do Google, não o sistema.
    contexto: [
      { nome: 'Android', icone: 'android', nota: 'o que saiu foi o Android do Google' },
    ],
    para: [
      { nome: 'GrapheneOS', url: 'https://grapheneos.org/', icone: 'grapheneos' },
      { nome: 'LineageOS', url: 'https://lineageos.org/', icone: 'lineageos' },
    ],
  },
  {
    categoria: 'Sistema do computador',
    de: [{ nome: 'Windows', icone: 'windows' }],
    para: [
      { nome: 'Arch Linux', url: 'https://archlinux.org/', icone: 'archlinux' },
      { nome: 'NixOS', url: 'https://nixos.org/', icone: 'nixos', nota: 'meu favorito' },
      { nome: 'Tails', url: 'https://tails.net/', icone: 'tails' },
      { nome: 'Ubuntu Server', url: 'https://ubuntu.com/server', icone: 'ubuntu' },
      // Sem marca no Simple Icons e sem vetor publicado: cai na caixa vazia.
      { nome: 'Omarchy', url: 'https://omarchy.org/' },
    ],
  },
  {
    categoria: 'Loja de aplicativos',
    de: [{ nome: 'Play Store', icone: 'googleplay' }],
    para: [
      { nome: 'Obtainium', url: 'https://obtainium.imranr.dev/', icone: 'obtainium', nota: 'para baixar APKs de repositórios (ex.: GitHub Releases)' },
      { nome: 'F-Droid', url: 'https://f-droid.org/', icone: 'fdroid' },
      { nome: 'Aurora Store', url: 'https://auroraoss.com/', icone: 'aurorastore', nota: 'cliente que se conecta à API do Google e baixa os APKs' },
    ],
  },
  {
    categoria: 'Teclado',
    // O "G" do Google identifica o dono, não o produto: nem o Gboard nem o
    // Find Hub têm vetor publicado, e o Simple Icons tirou as marcas da
    // Microsoft e da Amazon do projeto. Dono certo vale mais que caixa vazia.
    de: [{ nome: 'Gboard', icone: 'google' }],
    para: [{ nome: 'FUTO Keyboard', url: 'https://keyboard.futo.org/' }],
  },
  {
    // "Find Hub" é o nome de hoje do que já se chamou Encontre Meu Dispositivo.
    categoria: 'Localizar aparelho',
    de: [{ nome: 'Find Hub', icone: 'google' }],
    para: [{ nome: 'FMD', url: 'https://fmd-foss.org/', icone: 'fmd' }],
  },
  {
    categoria: 'Acesso remoto',
    de: [{ nome: 'AnyDesk', icone: 'anydesk' }],
    para: [{ nome: 'RustDesk', url: 'https://rustdesk.com/', icone: 'rustdesk' }],
  },
  {
    categoria: 'Repositório',
    contexto: [{ nome: 'GitHub', icone: 'github' }],
    para: [{ nome: 'Forgejo', url: 'https://forgejo.org/', icone: 'forgejo' }],
  },
  {
    // A única categoria sem alternativa nenhuma: o domínio está na Cloudflare e
    // não há para onde ir hoje. Fica como contexto, sozinha, porque calar a
    // categoria seria esconder uma dependência que existe. Se um dia entrar um
    // registrador no lugar, ele entra como `para` e esta linha some ou vira
    // remoção.
    categoria: 'Domínio',
    contexto: [{ nome: 'Cloudflare Registrar', icone: 'cloudflare' }],
    para: [],
  },
];
