import { getCollection } from 'astro:content';
import { principles, services } from './site.config';

/**
 * Índice de busca do site, montado no build e servido como JSON estático por
 * `src/pages/busca.json.ts`. A página `/busca/` baixa esse arquivo uma vez e
 * filtra no navegador — nenhuma requisição sai do domínio, que é o que o
 * rodapé promete.
 *
 * Por que um arquivo separado e não os dados embutidos na página: o corpo dos
 * posts entra inteiro no índice (é o que faz a busca achar "pasta térmica"
 * dentro de um parágrafo), então ele cresce junto com o blog. Embutido, esse
 * peso viria em toda visita a `/busca/`, inclusive no prefetch ao passar o
 * mouse no cabeçalho. Separado, ele é baixado só por quem abre a busca e o
 * navegador o guarda em cache.
 */

export type TipoItem = 'Serviço' | 'Página' | 'Post' | 'Projeto' | 'Tag';

export interface ItemBusca {
  tipo: TipoItem;
  url: string;
  titulo: string;
  /** Frase mostrada no resultado quando o termo não aparece no corpo. */
  descricao: string;
  /** Casa mas não é exibido: corpo do post, pontos do serviço, sinônimos. */
  texto: string;
  tags: string[];
}

/**
 * Markdown vira texto corrido. Não precisa ser um parser: o que sobra é
 * comparado com o que a pessoa digitou, e sintaxe (`##`, `**`, `[]()`) só
 * atrapalharia essa comparação. Bloco de código sai inteiro — nome de comando
 * dentro de exemplo não é assunto do post.
 */
function textoDoMarkdown(md: string): string {
  return md
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`\n]*`/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/^\s{0,3}>\s?/gm, '')
    .replace(/^\s{0,3}#{1,6}\s+/gm, '')
    .replace(/^\s{0,3}([-*+]|\d+\.)\s+/gm, '')
    // Linha de separação de tabela e traço temático. Sem isto o trecho de um
    // resultado começava com "Serviço Função --- ---".
    .replace(/-{3,}/g, ' ')
    // Ênfase some sem deixar espaço: `**liberdade**,` virava "liberdade ,".
    .replace(/[*_~]/g, '')
    .replace(/\|/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Texto das páginas institucionais.
 *
 * Isto **não** é cópia da `<meta description>` de cada página: é a frase que
 * faz sentido ler numa lista de resultados, onde o leitor está decidindo em
 * qual link clicar. As duas podem divergir sem que nada quebre.
 *
 * O campo `texto` existe para o que a pessoa digita mas não está escrito na
 * página com essas palavras: "email" sem hífen, "orçamento", "cv". Sinônimo de
 * busca, não texto de marketing.
 */
const paginas: ItemBusca[] = [
  {
    tipo: 'Página',
    url: '/',
    titulo: 'Início',
    descricao: 'Os três serviços, os princípios que guiam o trabalho e os projetos em destaque.',
    texto: principles.map((p) => `${p.title} ${p.body}`).join(' '),
    tags: [],
  },
  {
    tipo: 'Página',
    url: '/servicos/',
    titulo: 'Serviços',
    descricao: 'Os três serviços em detalhe: o que entra em cada um e como eu atendo.',
    texto: 'atendimento presencial remoto orçamento preço valor contratar recolher equipamento agendamento',
    tags: [],
  },
  {
    tipo: 'Página',
    url: '/sobre/',
    titulo: 'Sobre',
    descricao: 'Quem está por trás da NextLevelCode e por que as três frentes se conectam.',
    texto: 'currículo cv experiência formação como eu trabalho princípios liberdade privacidade',
    tags: [],
  },
  {
    tipo: 'Página',
    url: '/contato/',
    titulo: 'Contato',
    descricao: 'Como falar comigo: e-mail direto, sem formulário e sem intermediário.',
    texto: 'email endereço falar chamar orçamento forgejo github substack newsletter rss',
    tags: [],
  },
  {
    tipo: 'Página',
    url: '/blog/',
    titulo: 'Blog',
    descricao: 'Todos os posts publicados, com as etiquetas mais usadas em destaque.',
    texto: 'artigos textos notas feed rss assinar',
    tags: [],
  },
  {
    tipo: 'Página',
    url: '/projetos/',
    titulo: 'Projetos',
    descricao: 'O que eu construo e mantenho, com o estágio de cada projeto.',
    texto: 'repositório código aberto open source ativo concluído arquivado',
    tags: [],
  },
  {
    tipo: 'Página',
    url: '/tags/',
    titulo: 'Tags',
    descricao: 'Todos os assuntos que já apareceram em posts e projetos.',
    texto: 'etiquetas assuntos temas índice',
    tags: [],
  },
];

export async function construirIndice(): Promise<ItemBusca[]> {
  // O filtro de rascunho vale aqui como vale em toda listagem: sem ele, um
  // post não publicado apareceria na busca com título, trecho e link.
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  const projetos = await getCollection('projetos', ({ data }) => !data.draft);

  const itens: ItemBusca[] = [
    ...services.map(
      (service): ItemBusca => ({
        tipo: 'Serviço',
        url: `/servicos/#${service.slug}`,
        titulo: service.title,
        descricao: service.summary,
        // Separados por ponto médio, e não por espaço: o trecho do resultado
        // mostra um pedaço deste texto, e emendado ele vira uma frase que não
        // fecha ("...manutenção preventiva Configuração de redes...").
        texto: service.points.join(' · '),
        tags: [],
      }),
    ),
    ...paginas,
    ...posts.map(
      (post): ItemBusca => ({
        tipo: 'Post',
        url: `/blog/${post.id}/`,
        titulo: post.data.title,
        descricao: post.data.description,
        texto: textoDoMarkdown(post.body ?? ''),
        tags: [...post.data.tags],
      }),
    ),
    ...projetos.map(
      (projeto): ItemBusca => ({
        tipo: 'Projeto',
        url: `/projetos/${projeto.id}/`,
        titulo: projeto.data.title,
        descricao: projeto.data.description,
        texto: textoDoMarkdown(projeto.body ?? ''),
        tags: [...projeto.data.tags],
      }),
    ),
  ];

  // As tags entram como item próprio: quem busca "linux" quase sempre quer a
  // lista inteira do assunto, não só o post que menciona a palavra. Elas ficam
  // no fim do desempate (ver PESO_TIPO na página) para não empurrar para baixo
  // o conteúdo que responde de fato.
  const contagem = new Map<string, number>();
  for (const item of [...posts, ...projetos]) {
    for (const tag of item.data.tags) contagem.set(tag, (contagem.get(tag) ?? 0) + 1);
  }

  for (const [tag, total] of [...contagem].sort((a, b) => a[0].localeCompare(b[0], 'pt-BR'))) {
    itens.push({
      tipo: 'Tag',
      url: `/tags/${tag}/`,
      titulo: tag,
      // Sem repetir o nome da tag, que já é o título logo acima: repetido, ele
      // casava duas vezes e jogava a etiqueta na frente do texto que ela marca.
      descricao: `${total} ${total === 1 ? 'item marcado' : 'itens marcados'} com esta etiqueta.`,
      texto: '',
      tags: [tag],
    });
  }

  return itens;
}
