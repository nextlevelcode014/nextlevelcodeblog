import type { APIRoute } from 'astro';
import { construirIndice } from '../busca';

/**
 * Índice da busca, gerado no build. Sem adaptador o site é 100% estático, então
 * isto vira um `busca.json` no `dist/` — arquivo servido pelo mesmo domínio,
 * como qualquer outro. Quem consome é `src/pages/busca.astro`.
 */
export const GET: APIRoute = async () => {
  const itens = await construirIndice();

  return new Response(JSON.stringify(itens), {
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });
};
