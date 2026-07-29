---
title: 'Homelab soberano'
description: 'Infraestrutura doméstica que substitui serviços de nuvem: arquivos, senhas, mídia, DNS e VPN — tudo rodando em hardware próprio.'
order: 1
year: '2024 — hoje'
status: 'ativo'
tags: ['homelab', 'linux', 'privacidade', 'docker']
---

O laboratório onde quase todo o resto é testado antes de chegar em um cliente.

## O que roda

- **Proxmox** como hipervisor, com VMs separadas por nível de confiança
- **Nextcloud** para arquivos e calendário, no lugar de Drive e Google Agenda
- **Vaultwarden** para senhas, sincronizando só dentro da rede e via VPN
- **Jellyfin** para mídia local
- **Pi-hole + Unbound** para DNS: bloqueio de rastreadores e resolução recursiva
  própria, sem entregar o histórico de navegação a um resolvedor de terceiros
- **WireGuard** como único ponto de entrada externo

## Decisões que valeram a pena

**Nada exposto direto na internet.** O único serviço aberto é o WireGuard. Tudo o mais
só existe depois que o túnel sobe. Isso elimina de uma vez a categoria inteira de
ataques automatizados contra painéis administrativos.

**Segmentação por VLAN.** Câmeras e dispositivos de IoT vivem numa rede que não
enxerga o resto. Se um deles for comprometido — e o firmware desses aparelhos quase
nunca recebe atualização — o estrago fica contido.

**Backup antes de serviço novo.** Nenhum container entra no ar sem estar no plano de
backup. Serviço sem backup é serviço que vai doer.

## O que eu faria diferente

Comecei com um único servidor grande. Hoje eu começaria com dois pequenos: manutenção
sem downtime vale mais que a soma dos núcleos.
