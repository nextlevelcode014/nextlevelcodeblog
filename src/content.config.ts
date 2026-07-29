import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
// O `z` reexportado por `astro:content` é o Zod v3 e está marcado como
// deprecado no Astro 7. `astro/zod` é o v4, que é o caminho atual.
import { z } from 'astro/zod';

/**
 * `glob()` é o loader da Content Layer: ele lê os arquivos do disco e valida
 * cada frontmatter contra o schema abaixo. Se você escrever um post com uma
 * tag que não é string ou esquecer a data, o build falha — erro em build vale
 * mais que um post quebrado em produção.
 */

const blog = defineCollection({
  loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdoc}' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

const projetos = defineCollection({
  loader: glob({ base: './src/content/projetos', pattern: '**/*.{md,mdoc}' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    // Ordena a listagem; número menor aparece primeiro.
    order: z.number().default(99),
    year: z.string(),
    status: z.enum(['ativo', 'concluído', 'arquivado']).default('ativo'),
    tags: z.array(z.string()).default([]),
    repo: z.string().url().optional(),
    demo: z.string().url().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog, projetos };
