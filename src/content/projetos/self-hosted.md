---
title: 'Self-hosted'
description: 'Minha infraestrutura pessoal: Googlo, WhatsApp, DNS, Netflix, AnyDesk, Senhas e muito mais'
order: 1
year: '2026'
status: 'ativo'
tags: ['self-hosted', 'homelab', 'docker', 'tailscale', 'privacidade', 'seguranca']
repo: 'https://forgejo.tail181a66.ts.net/nextlevelcode/self-hosted'
---

Junção de varias alternativas open source com objetivo de criar uma infraestrutura
pessoal, usando uma stack de serviços que julgo essenciais.

Configurar e manter todos esses serviços custa tempo, não é um hobby, são
princípios: **liberdade**, **privacidade** e **segurança**. Liberdade de customização, configuração,
planejamento. Privacidade de revelar apenas aquilo que me interessa. Segurança
é a responsabilidade de cuidar das sua coisas, então arcar com as consequências.

Embora esse projeto tenha sido pensando nos meus interesses pessoais, configurações, dicas e soluções
encontradas na minha jornada podem servir como base, oferecendo sugestões e ideias.

## O que hospedo atualmente

| Serviço | Função |
|---|---|
| Nextcloud AIO | Backup, Comunicação, Syncronização... |
| Immich | Galeria de fotos e vídeos |
| Vaultwarden | Gerenciador de senhas |
| SearXNG | Motor de busca |
| AdGuard Home | DNS |
| Arr Stack | Streaming |
| RustDesk | Acesso remoto |
| Gluetun | VPN para os containers |


Cada serviço exige conhecimento, configurações e particularidades especificas.
Felizmente com docker tudo fica mais fácil, gerenciar aplicações que antes exigia
anos de experiencia na area tornou-se mais simples.

## Como foi pensado
Todo acesso externo é feito via Tailscale, arquivos de configurações são praticamente
todos docker composes, com exceção de configurações específicos de de cada serviço.

Isso tudo está fisicamente em um Raspberry PI 5 com 8GB de ram e um SSD externo de um 1T. Um hardware
capaz e eficiente, portável, pouco consumo de energia e extensível.

O SSD tem 3 partições, sendo uma para o boot e firmware, segunda para o root e uma ultima criptografada
para os dados. Isso adiciona uma camada de segurança contra roubo físico do SSD.

Usar só um SSD não é ideal para meu modelo, por isso pretendo expandir mais a frente para um NVMe.

Existe um script shell para auxiliar na organização da infraestrutura: arquivos de configurações,
composes, containers, ENVs e etc.

O sistema de backup é automatizado, sendo a implementação especifica de acordo com o serviço.
Os backups sempre saem do PI criptografados para dois servidores diferentes.
