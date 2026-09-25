#!/usr/bin/env bun
/**
 * Otimiza imagens para o blog usando sharp.
 * Uso: bun run otimiza:img <arquivo|diretorio>
 *
 * - Redimensiona para largura máxima 1200px
 * - JPEG: qualidade 85, progressive, mozjpeg
 * - PNG: compressão com palette quando possível
 * - Remove todos os metadados EXIF/GPS/XMP (sharp descarta por padrão ao re-encodar)
 * - Faz backup como .original antes de sobrescrever
 */

import { existsSync, statSync, renameSync, readdirSync } from 'fs';
import { resolve, extname, basename, dirname } from 'path';
import sharp from 'sharp';

const MAX_WIDTH = 1200;
const JPEG_QUALITY = 85;

function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

async function otimizarArquivo(caminho) {
  const ext = extname(caminho).toLowerCase();
  if (!['.jpg', '.jpeg', '.png'].includes(ext)) {
    console.log(`  ⏭️  Ignorado (formato não suportado): ${basename(caminho)}`);
    return;
  }

  const stats = statSync(caminho);
  const tamanhoOriginal = stats.size;

  // Faz backup
  const backupPath = caminho + '.original';
  if (!existsSync(backupPath)) {
    renameSync(caminho, backupPath);
  }

  const input = sharp(backupPath);
  const metadata = await input.metadata();

  let pipeline = input.resize(MAX_WIDTH, null, { withoutEnlargement: true });

  if (ext === '.png') {
    pipeline = pipeline.png({ compressionLevel: 9, palette: true });
  } else {
    pipeline = pipeline.jpeg({ quality: JPEG_QUALITY, progressive: true, mozjpeg: true });
  }

  await pipeline.toFile(caminho);

  const tamanhoNovo = statSync(caminho).size;
  const economia = tamanhoOriginal - tamanhoNovo;
  const percentual = ((economia / tamanhoOriginal) * 100).toFixed(1);

  console.log(`  ✅ ${basename(caminho)}`);
  console.log(`     ${formatBytes(tamanhoOriginal)} → ${formatBytes(tamanhoNovo)} (${percentual}% menor, ${metadata.width}x${metadata.height})`);
}

async function otimizarDiretorio(dir) {
  const arquivos = readdirSync(dir)
    .filter(f => ['.jpg', '.jpeg', '.png'].includes(extname(f).toLowerCase()))
    .map(f => resolve(dir, f));

  if (arquivos.length === 0) {
    console.log('Nenhuma imagem encontrada no diretório.');
    return;
  }

  console.log(`Otimizando ${arquivos.length} imagem(ns) em ${dir}...\n`);

  for (const arquivo of arquivos) {
    await otimizarArquivo(arquivo);
  }
}

async function main() {
  const alvo = process.argv[2];

  if (!alvo) {
    console.error('Uso: bun run otimiza:img <arquivo|diretorio>');
    console.error('Exemplo: bun run otimiza:img src/assets/blog/meu-post/');
    process.exit(1);
  }

  const caminho = resolve(alvo);

  if (!existsSync(caminho)) {
    console.error(`❌ Caminho não encontrado: ${caminho}`);
    process.exit(1);
  }

  const stats = statSync(caminho);

  if (stats.isDirectory()) {
    await otimizarDiretorio(caminho);
  } else {
    await otimizarArquivo(caminho);
  }

  console.log('\nPronto! Backups salvos como .original');
}

main().catch(err => {
  console.error('❌ Erro:', err.message);
  process.exit(1);
});
