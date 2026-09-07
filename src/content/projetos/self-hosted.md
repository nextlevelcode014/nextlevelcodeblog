---
title: 'Self-hosted'
description: 'Minha infraestrutura pessoal: Googlo, WhatsApp, DNS, Netflix, AnyDesk, Find Hub, Senhas e muito mais'
order: 1
year: '2026'
status: 'ativo'
tags: ['self-hosted', 'homelab', 'docker', 'tailscale', 'privacidade', 'seguranca']
repo: 'https://forgejo.tail181a66.ts.net/nextlevelcode/self-hosted'
---

Stack de serviços open source self-hosted em um Raspberry Pi 5 com 8 GB de RAM mais um SSD de 1 TB.

Ainda em fase de desenvolvimento, principalmente na expansão da capacidade de armazenamento, backups e resiliência.

No momento da escrita deste texto existem 13 stacks (12 diretórios de serviço) → 46 containers declarados.

| Stack | Containers | Detalhe |
|---|---:|---|
| arr | 20 | 11 apps + 9 sidecars Tailscale |
| immich | 5 | server, ML, redis, postgres + sidecar |
| forgejo | 3 | server, db + sidecar |
| rustdesk-server | 3 | hbbs, hbbr + sidecar |
| searxng | 3 | core, valkey + sidecar |
| adguard | 2 | app + sidecar |
| exit-node | 2 | gluetun-exit + sidecar |
| fmd | 2 | app + sidecar |
| vaultwarden | 2 | app + sidecar |
| gluetun | 1 | gateway VPN compartilhado |
| nextcloud | 1 | mastercontainer AIO (gera os próprios containers filhos) |
| nextcloud (coturn) | 1 | compose separado, TURN para o nextcloud talk |
| forgejo-runner | 1 | implementa integração contínua no forgejo |

São:
- 17 sidecars tailscale/tailscale (ingress de cada serviço)
- 29 containers de serviços da infraestrutura

## Como foi implementado

Todo acesso externo é feito via Tailscale, arquivos de configuração são praticamente
todos docker composes, com exceção de configurações específicas de cada serviço.

O SSD tem 3 partições, sendo uma para o boot e firmware, a segunda para o root e uma última criptografada
para os dados. Isso adiciona uma camada de segurança contra roubo físico do SSD.

Usar só um SSD não é ideal para meu modelo, por isso pretendo expandir mais à frente para mais um SSD e um NVMe.

Existe um script shell para auxiliar na organização da infraestrutura: arquivos de configuração, atualizações,
composes, containers, ENVs etc.

O sistema de backup é automatizado, sendo a implementação específica de acordo com o serviço.
Os backups sempre saem do Pi criptografados para dois servidores diferentes.

## Motivação
Privacidade. Comecei a me incomodar de ver como as grandes empresas do mainstream tratam nossos dados, além de
estudar casos passados de vigilância governamental e novas leis sem nenhum respaldo técnico sendo pautadas no
meu país e ao redor do mundo.

Não consigo normalizar esse consenso, então comecei a migrar tudo que pude para alternativas de privacidade. Então,
nada mais privado que eu gerenciar minha própria infra e ter realmente soberania dos meus dados.

Muitos podem dizer que isso não faz sentido, que é perda de tempo.
Eu não gosto dessa ideia, o que eu puder fazer eu vou fazer, simplesmente aceitar não é uma alternativa. Isso é o que
diferencia as pessoas que dizem que se importam com privacidade das que realmente fazem algo sobre isso.
