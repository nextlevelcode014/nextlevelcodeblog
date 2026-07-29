---
title: 'Por que eu entrego sites estáticos'
description: 'Menos partes móveis significa menos superfície de ataque, menos custo mensal e menos coisa para quebrar às três da manhã.'
pubDate: 2026-07-11
tags: ['web', 'seguranca', 'performance']
---

Quando alguém me pede um site institucional, a resposta quase sempre é: HTML gerado no
build, servido como arquivo. Sem PHP, sem banco, sem painel administrativo exposto na
internet.

Isso costuma soar antiquado até eu explicar o que se ganha.

## Superfície de ataque perto de zero

Um site estático não tem interpretador rodando no servidor. Não existe SQL injection
porque não existe SQL. Não existe painel `/wp-admin` para alguém tentar força bruta.
O que o atacante encontra é um servidor entregando arquivos.

A maior parte dos sites de pequenos negócios que eu vejo invadidos cai por um plugin
desatualizado — um componente que o dono nem sabia que estava instalado. Software que
não existe não precisa de patch.

## Performance que não depende de sorte

Página estática atrás de um CDN responde em dezenas de milissegundos, para qualquer
volume de acesso. Não há *cold start*, não há pool de conexões esgotado, não há query
lenta em horário de pico.

> A página mais rápida é a que já estava pronta antes de alguém pedir.

## Custo que tende a zero

Hospedagem de arquivo estático é praticamente gratuita em qualquer provedor. Sem
servidor de aplicação, sem banco gerenciado, sem licença de plugin. O cliente paga o
domínio e pouco mais.

## Onde estático não serve

Sendo honesto sobre o limite: se o site precisa de login de usuário, carrinho com
estoque em tempo real ou conteúdo que muda a cada minuto, estático puro vira ginástica.
Aí a resposta certa é outra arquitetura — normalmente estático **mais** um punhado de
funções sob demanda, não um monólito dinâmico inteiro.

O ponto não é dogma. É perguntar quanta máquina o problema realmente exige, em vez de
começar pela mais complexa e justificar depois.
