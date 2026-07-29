#!/usr/bin/env bun
/**
 * Cria um post ou projeto novo já com o frontmatter preenchido.
 * O equivalente ao `hugo new` — evita digitar o cabeçalho de memória e errar
 * um campo que só vai estourar na hora do build.
 *
 *   bun run novo:post "Meu título aqui"
 *   bun run novo:projeto "Nome do projeto"
 */
import { existsSync } from 'node:fs';
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';

const args = process.argv.slice(2);
const isProjeto = args.includes('--projeto');
const titulo = args.filter((a) => !a.startsWith('--')).join(' ').trim();

if (!titulo) {
  console.error('Uso: bun run novo:post "Título do post"');
  process.exit(1);
}

/** "Backup 3-2-1 no Homelab" -> "backup-3-2-1-no-homelab" */
function slugify(texto: string): string {
  return texto
    .normalize('NFD') // separa a letra do acento: "ç" vira "c" + cedilha
    .replace(/[̀-ͯ]/g, '') // descarta os acentos soltos
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')         // tudo que não é letra/número vira hífen
    .replace(/^-+|-+$/g, '');            // sem hífen sobrando nas pontas
}

const slug = slugify(titulo);
const hoje = new Date().toISOString().slice(0, 10);
const pasta = isProjeto ? 'projetos' : 'blog';
const destino = join('src', 'content', pasta, `${slug}.md`);

if (existsSync(destino)) {
  console.error(`Já existe: ${destino}`);
  process.exit(1);
}

// `draft: true` por padrão: o arquivo nasce invisível para o site publicado,
// então dá para começar a escrever sem medo de publicar pela metade.
const frontmatter = isProjeto
  ? `---
title: '${titulo.replace(/'/g, "''")}'
description: 'Uma frase sobre o projeto.'
order: 99
year: '${hoje.slice(0, 4)}'
status: 'ativo'
tags: []
draft: true
---

Escreva aqui.
`
  : `---
title: '${titulo.replace(/'/g, "''")}'
description: 'Uma frase — aparece na listagem, no RSS e no Google.'
pubDate: ${hoje}
tags: []
draft: true
---

Escreva aqui.
`;

await mkdir(dirname(destino), { recursive: true });
await writeFile(destino, frontmatter, 'utf8');

console.log(`Criado: ${destino}`);
console.log(`URL:    /${pasta === 'blog' ? 'blog' : 'projetos'}/${slug}/`);
console.log(`\nEstá como rascunho. Tire o \`draft: true\` quando quiser publicar.`);
