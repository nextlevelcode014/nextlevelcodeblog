---
title: 'nextlevelcode.pro'
description: 'Este site: estático, sem rastreadores, sem cookies e sem uma única requisição para domínio de terceiro.'
order: 2
year: '2026'
status: 'ativo'
tags: ['web', 'astro', 'performance', 'privacidade']
---

O site que você está lendo, construído como demonstração do que eu entrego.

## Restrições autoimpostas

- **Zero requisições externas.** Fontes, ícones e estilos são servidos do próprio
  domínio. Nenhum CDN recebe o IP de quem visita.
- **Zero JavaScript de terceiros.** Sem analytics, sem pixel, sem chat widget.
- **Zero cookies.** Não há banner de consentimento porque não há o que consentir.
- **HTML gerado no build.** O servidor entrega arquivos; não há aplicação rodando.

## Como está feito

Astro gera o HTML, o CSS usa camadas em cascata (`@layer`), `light-dark()` para os dois
temas e `animation-timeline: view()` para as animações de entrada — o que significa que
as revelações ao rolar a página não custam **nenhum** JavaScript.

O único script que vai para o navegador tem duas funções: gravar a preferência de tema
e trocar o atributo no `<html>`. São poucas linhas, e ele é inline justamente para
rodar antes da primeira pintura e evitar o flash de tela clara.

## Resultado

Carrega em conexão ruim, funciona com JavaScript desligado (menos o botão de tema),
respeita `prefers-reduced-motion` e passa em contraste AA nos dois temas — o azul da
marca troca de tom no tema claro exatamente por isso.
