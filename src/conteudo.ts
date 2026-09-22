import { getCollection, type CollectionEntry, type CollectionKey } from 'astro:content';

/**
 * Leitura de coleção com o filtro de rascunho embutido.
 *
 * **Por que existe.** `draft` é campo do schema deste site
 * (`content.config.ts`), não do Astro: o `markdown.drafts` das versões antigas
 * saiu junto com a API de conteúdo legada, e a Content Layer não sabe que esse
 * booleano quer dizer "não publique". O filtro é nosso, e precisa estar em
 * toda consulta — listagem, tag, RSS, sitemap e busca. Repetido à mão em quinze
 * lugares, esquecê-lo em um é questão de tempo, e o esquecimento não aparece
 * nem no build nem no `astro check`: o rascunho simplesmente vaza. Aqui a regra
 * é o caminho mais curto, e não disciplina.
 *
 * **Por que `import.meta.env.DEV`.** Em `astro dev` o rascunho aparece, que é o
 * ponto de escrever um; em `astro build` ele some. Como `bun run preview` serve
 * o `dist/`, a conferência antes de publicar mostra o site de verdade. Não há
 * variável para ligar isso à mão de propósito: flag que se liga também se
 * esquece ligada, e o preço do engano é rascunho publicado.
 *
 * Prefira esta função a `getCollection` em qualquer lugar que liste conteúdo.
 * Chamar `getCollection` direto continua possível, e continua sendo você
 * assumindo o filtro.
 */
export function publicados<C extends CollectionKey>(
  colecao: C,
): Promise<CollectionEntry<C>[]> {
  return getCollection(colecao, ({ data }) => import.meta.env.DEV || !data.draft);
}
