#!/usr/bin/env bun
/**
 * Driver de verificação visual do site — zero dependências.
 *
 * Fala CDP (Chrome DevTools Protocol) direto por WebSocket, em vez de usar
 * Playwright ou Puppeteer. Motivo: o projeto tem três dependências de runtime
 * e a promessa do rodapé é justamente não carregar peso desnecessário; instalar
 * ~300MB de navegador para tirar screenshot contradiria isso. O bun já traz
 * fetch e WebSocket, então o driver inteiro cabe neste arquivo.
 *
 *   bun .claude/skills/run-site/driver.mjs shot /blog/ --out /tmp/shots/blog.png
 *   bun .claude/skills/run-site/driver.mjs audit
 *   bun .claude/skills/run-site/driver.mjs eval / "document.title"
 *
 * Requer um servidor já no ar (ver SKILL.md) e um binário Chromium.
 */
import { spawn } from 'node:child_process';
import { mkdir, writeFile, rm, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname } from 'node:path';

const BASE = process.env.SITE_URL ?? 'http://localhost:4321';

// Ordem de preferência. O primeiro que existir vence; BROWSER_BIN sobrepõe tudo.
const CANDIDATOS = [
  process.env.BROWSER_BIN,
  '/opt/google/chrome/chrome',
  '/usr/bin/chromium',
  '/usr/bin/google-chrome',
  '/opt/brave.com/brave-origin-beta/brave',
].filter(Boolean);

function acharNavegador() {
  const bin = CANDIDATOS.find((c) => existsSync(c));
  if (!bin) {
    console.error(
      'Nenhum Chromium encontrado. Testei:\n  ' +
        CANDIDATOS.join('\n  ') +
        '\nDefina BROWSER_BIN=/caminho/do/binario.',
    );
    process.exit(1);
  }
  return bin;
}

/** Sobe o navegador headless e devolve { proc, porta, encerrar }. */
async function abrirNavegador() {
  const perfil = `/tmp/nlc-driver-${process.pid}`;
  const proc = spawn(
    acharNavegador(),
    [
      '--headless',
      '--remote-debugging-port=0', // porta 0 = o sistema escolhe; evita colisão
      `--user-data-dir=${perfil}`,
      '--hide-scrollbars',
      '--disable-gpu',
      '--force-color-profile=srgb',
      'about:blank',
    ],
    { stdio: ['ignore', 'pipe', 'pipe'] },
  );

  // A porta escolhida só aparece no stderr, na linha "DevTools listening on ws://…"
  const porta = await new Promise((resolve, reject) => {
    const prazo = setTimeout(() => reject(new Error('navegador não subiu em 20s')), 20_000);
    let buffer = '';
    proc.stderr.on('data', (d) => {
      buffer += d;
      const m = buffer.match(/ws:\/\/127\.0\.0\.1:(\d+)\//);
      if (m) {
        clearTimeout(prazo);
        resolve(Number(m[1]));
      }
    });
    proc.on('exit', (c) => reject(new Error(`navegador saiu com código ${c}\n${buffer}`)));
  });

  return {
    porta,
    async encerrar() {
      proc.kill();
      await rm(perfil, { recursive: true, force: true }).catch(() => {});
    },
  };
}

/** Cria uma aba e devolve um cliente CDP com `send(metodo, params)`. */
async function abrirAba(porta) {
  // Chrome novo exige PUT em /json/new; versões antigas aceitam GET.
  let alvo = await fetch(`http://127.0.0.1:${porta}/json/new?about:blank`, { method: 'PUT' })
    .then((r) => (r.ok ? r.json() : null))
    .catch(() => null);
  if (!alvo) {
    alvo = await fetch(`http://127.0.0.1:${porta}/json/new?about:blank`).then((r) => r.json());
  }

  const ws = new WebSocket(alvo.webSocketDebuggerUrl);
  await new Promise((ok, err) => {
    ws.onopen = ok;
    ws.onerror = () => err(new Error('não consegui abrir o WebSocket do CDP'));
  });

  let id = 0;
  const pendentes = new Map();
  ws.onmessage = (ev) => {
    const msg = JSON.parse(ev.data);
    const p = pendentes.get(msg.id);
    if (!p) return; // evento, não resposta
    pendentes.delete(msg.id);
    msg.error ? p.reject(new Error(msg.error.message)) : p.resolve(msg.result);
  };

  const send = (method, params = {}) =>
    new Promise((resolve, reject) => {
      const meu = ++id;
      pendentes.set(meu, { resolve, reject });
      ws.send(JSON.stringify({ id: meu, method, params }));
    });

  await send('Page.enable');
  await send('Runtime.enable');
  return { send, fechar: () => ws.close() };
}

/** Navega, aplica viewport e tema, espera a fonte carregar. */
async function preparar(cli, rota, { largura, altura, tema, congelar = true, rolarAte }) {
  await cli.send('Emulation.setDeviceMetricsOverride', {
    width: largura,
    height: altura,
    deviceScaleFactor: 1,
    mobile: largura < 640,
  });

  const url = rota.startsWith('http') ? rota : BASE + rota;
  const r = await cli.send('Page.navigate', { url });

  // Sem isto o driver "tem sucesso" fotografando a tela de erro do Chromium:
  // Page.navigate resolve normalmente e só sinaliza a falha em errorText.
  if (r.errorText) {
    throw new Error(
      `${url} não carregou: ${r.errorText}\n` +
        `O servidor está no ar? \`bun run dev\` ou \`bun run preview\`.`,
    );
  }

  // `document.fonts.ready` é o sinal certo: sem ele o screenshot sai com a
  // fonte de fallback e o layout mede diferente.
  await cli.send('Runtime.evaluate', {
    expression: `new Promise(r => {
      const pronto = () => document.fonts.ready.then(r);
      document.readyState === 'complete' ? pronto() : addEventListener('load', pronto);
    })`,
    awaitPromise: true,
    timeout: 20_000,
  });

  if (tema) {
    await cli.send('Runtime.evaluate', {
      expression: `document.documentElement.dataset.theme = ${JSON.stringify(tema)};
                   try { localStorage.setItem('theme', ${JSON.stringify(tema)}) } catch {}`,
    });
  }

  if (rolarAte) {
    const achou = await cli.send('Runtime.evaluate', {
      expression: `(() => {
        const el = document.querySelector(${JSON.stringify(rolarAte)});
        if (!el) return false;
        el.scrollIntoView({ block: 'center', behavior: 'instant' });
        return true;
      })()`,
      returnByValue: true,
    });
    if (!achou.result.value) throw new Error(`nenhum elemento casa com "${rolarAte}"`);
  }

  if (congelar) {
    // Sem isto o screenshot pega um quadro qualquer da animação. O caso que
    // revelou o problema: a marca do hero tem `logo-draw` com 0.15s de atraso e
    // `fill-mode: both`, então durante o atraso ela fica com
    // `clip-path: inset(0 100% 0 0)` — some inteira da foto.
    // Duração 0 + fill both faz cada animação saltar direto para o estado final.
    await cli.send('Runtime.evaluate', {
      expression: `(() => {
        const s = document.createElement('style');
        s.textContent = \`*, *::before, *::after {
          animation-duration: 0s !important;
          animation-delay: 0s !important;
          transition-duration: 0s !important;
          transition-delay: 0s !important;
        }\`;
        document.head.appendChild(s);
        return document.getAnimations().length;
      })()`,
    });
  }
}

async function avaliar(cli, expressao) {
  const r = await cli.send('Runtime.evaluate', {
    expression: `(() => { try { return JSON.stringify(${expressao}) } catch (e) { return JSON.stringify(String(e)) } })()`,
    returnByValue: true,
  });
  return JSON.parse(r.result.value ?? 'null');
}

/**
 * Checagens que nem o build nem o `astro check` pegam, porque só existem
 * depois do CSS resolver. Todas já pegaram bug real neste repositório.
 */
const AUDITORIA = `(() => {
  const p = [];
  const de = document.documentElement;

  if (de.scrollWidth > innerWidth + 1) p.push('rolagem horizontal: ' + de.scrollWidth + 'px > ' + innerWidth + 'px');

  // Palavras coladas: o Astro descarta o espaço antes de uma tag inline quando
  // há quebra de linha no .astro. Já aconteceu seis vezes aqui.
  document.querySelectorAll('p a, p strong, p em, li a, li strong, h1 span, .lead strong').forEach(el => {
    const antes = el.previousSibling, depois = el.nextSibling, t = el.textContent;
    // Destaque de sigla — o \`**P**ortable\` de POSIX — é uma letra só abrindo a
    // palavra. Grudar no resto é o efeito pretendido, não espaço perdido.
    const sigla = t.length === 1 &&
      (!antes || antes.nodeType !== 3 || /[^\\p{L}\\p{N}]$/u.test(antes.textContent));
    if (antes?.nodeType === 3 && /[\\p{L}\\p{N}]$/u.test(antes.textContent) && /^[\\p{L}\\p{N}]/u.test(t))
      p.push('palavra colada: …' + antes.textContent.slice(-12) + '⟨' + t.slice(0,12) + '⟩');
    if (!sigla && depois?.nodeType === 3 && /[\\p{L}\\p{N}]$/u.test(t) && /^[\\p{L}\\p{N}]/u.test(depois.textContent))
      p.push('palavra colada: ⟨' + t.slice(-12) + '⟩' + depois.textContent.slice(0,12) + '…');
  });

  // .eyebrow dentro de .prose perde para .prose h2 por especificidade
  document.querySelectorAll('.eyebrow').forEach(e => {
    const fs = parseFloat(getComputedStyle(e).fontSize);
    if (fs > 13) p.push('eyebrow com ' + fs + 'px (esperado ~11px): "' + e.textContent.trim().slice(0,24) + '"');
  });

  document.querySelectorAll('body *').forEach(e => {
    const r = e.getBoundingClientRect();
    const cls = (e.className + '').split(' ')[0];
    if (r.width > 0 && (r.right > innerWidth + 2 || r.left < -2))
      p.push('estoura a viewport: ' + e.tagName.toLowerCase() + '.' + cls);
    const cs = getComputedStyle(e);
    // border-image anula border-radius silenciosamente
    if (cs.borderImageSource !== 'none' && parseFloat(cs.borderTopLeftRadius) > 0)
      p.push('border-image + border-radius: .' + cls);
    if (e.tagName === 'IMG' && !e.hasAttribute('alt')) p.push('img sem alt');
  });

  return [...new Set(p)];
})()`;

/**
 * As rotas saem do sitemap do build, não de uma lista escrita à mão.
 *
 * Lista fixa apodrece: apagar um post deixa a rota apontando para o nada, o
 * `astro preview` serve a página de 404 com status 200, e a auditoria passa
 * feliz tendo auditado a tela de erro. Isso já aconteceu duas vezes aqui.
 * O sitemap é gerado pelo mesmo build que produziu as páginas, então não tem
 * como divergir. O `/404` entra à parte, porque de propósito não é indexado.
 */
async function rotasPadrao() {
  const sitemap = 'dist/sitemap-0.xml';
  if (!existsSync(sitemap)) {
    throw new Error(
      `${sitemap} não existe — rode \`bun run build\` antes de auditar, ` +
        'ou passe as rotas na linha de comando.',
    );
  }
  const xml = await readFile(sitemap, 'utf8');
  const rotas = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
  return [...new Set([...rotas, '/404'])];
}

// ---------------------------------------------------------------- CLI

const [comando, ...resto] = process.argv.slice(2);
const flag = (nome, padrao) => {
  const i = resto.indexOf('--' + nome);
  return i === -1 ? padrao : resto[i + 1];
};
const posicionais = resto.filter((a, i) => !a.startsWith('--') && !resto[i - 1]?.startsWith('--'));

const largura = Number(flag('width', 1440));
const altura = Number(flag('height', 900));
const tema = flag('theme', 'dark');

if (!comando || comando === 'help') {
  console.log(`uso: bun .claude/skills/run-site/driver.mjs <comando>

  shot <rota> --out <arquivo> [--width 1440] [--height 900] [--theme dark|light] [--full]
  audit [--width 1440] [--theme dark|light] [rota…]      (sem rotas = todas)
  eval <rota> <expressão-js> [--theme …]

  --scroll-to <seletor>  centraliza o elemento antes de fotografar

  SITE_URL   servidor alvo (padrão ${BASE})
  BROWSER_BIN caminho do Chromium (padrão: primeiro encontrado)`);
  process.exit(0);
}

const nav = await abrirNavegador();
let falhou = false;

try {
  const cli = await abrirAba(nav.porta);

  if (comando === 'shot') {
    const rota = posicionais[0] ?? '/';
    const saida = flag('out', '/tmp/shots/site.png');
    await preparar(cli, rota, { largura, altura, tema, congelar: !resto.includes('--animate'), rolarAte: flag('scroll-to') });
    const { data } = await cli.send('Page.captureScreenshot', {
      format: 'png',
      captureBeyondViewport: resto.includes('--full'),
      ...(resto.includes('--full') ? { clip: undefined } : {}),
    });
    await mkdir(dirname(saida), { recursive: true });
    await writeFile(saida, Buffer.from(data, 'base64'));
    console.log(`${saida}  (${rota} · ${largura}px · ${tema})`);
  } else if (comando === 'audit') {
    const rotas = posicionais.length ? posicionais : await rotasPadrao();
    let total = 0;
    for (const rota of rotas) {
      await preparar(cli, rota, { largura, altura, tema, congelar: !resto.includes('--animate'), rolarAte: flag('scroll-to') });
      const achados = await avaliar(cli, AUDITORIA);
      if (achados.length) {
        total += achados.length;
        console.log(`\n${rota}  (${largura}px · ${tema})`);
        achados.forEach((a) => console.log('  ✗ ' + a));
      }
    }
    if (total) {
      console.log(`\n${total} problema(s) em ${rotas.length} rota(s).`);
      falhou = true;
    } else {
      console.log(`✓ ${rotas.length} rota(s) sem problemas  (${largura}px · ${tema})`);
    }
  } else if (comando === 'eval') {
    const [rota, ...expr] = posicionais;
    await preparar(cli, rota ?? '/', { largura, altura, tema, congelar: !resto.includes('--animate'), rolarAte: flag('scroll-to') });
    console.log(JSON.stringify(await avaliar(cli, expr.join(' ')), null, 2));
  } else {
    console.error(`comando desconhecido: ${comando}`);
    falhou = true;
  }

  cli.fechar();
} finally {
  await nav.encerrar();
}

process.exit(falhou ? 1 : 0);
