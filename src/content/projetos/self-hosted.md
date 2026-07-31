---
title: 'Self-hosted'
description: 'Infraestrutura pessoal numa Raspberry Pi 5: nuvem, fotos, senhas, DNS e busca rodando em casa, com entrada só pela tailnet e dado cifrado em repouso.'
order: 1
year: '2026 — hoje'
status: 'ativo'
tags: ['self-hosted', 'homelab', 'docker', 'tailscale', 'privacidade', 'seguranca']
repo: 'https://forgejo.tail181a66.ts.net/nextlevelcode/self-hosted'
---

Substituir serviço de nuvem por hardware próprio, um serviço de cada vez. Cada pasta
do repositório é um serviço independente definido por um `compose.yml`, e o conjunto
roda numa Raspberry Pi 5 com Ubuntu Server, bootando de um SSD de 1 TB por USB.

## O que roda

| Serviço | Função |
|---|---|
| Nextcloud AIO | Nuvem, chamadas e documentos |
| Immich | Fotos e vídeos |
| Vaultwarden | Senhas — e a fonte dos segredos de todos os outros |
| SearXNG | Meta-buscador, sem perfil de quem pesquisa |
| AdGuard Home | DNS e bloqueio de rastreadores |
| Arr Stack | Mídia: Jellyfin, Sonarr/Radarr, Prowlarr, qBittorrent |
| RustDesk | Acesso remoto |
| Gluetun | Gateway VPN compartilhado |
| Forgejo | O servidor git que hospeda este repositório |

## As quatro decisões que sustentam o resto

**Entrada só pela tailnet.** Quase todo serviço sobe com um sidecar do Tailscale e é
publicado por `tailscale serve` — nada fica exposto na internet aberta. A exceção é
uma só e é deliberada: a web do Forgejo sai por Tailscale Funnel para leitura
anônima, enquanto o SSH continua restrito à tailnet. Quem chega de fora lê o código
e não altera nada.

**Saída pela VPN onde importa.** O Gluetun é o gateway ProtonVPN/WireGuard, e os
serviços sensíveis usam o namespace de rede dele. O detalhe que faz isso valer
alguma coisa é o killswitch: se o túnel cai, eles ficam sem rede — em vez de
continuar funcionando e vazar.

**Cifrado em repouso.** A Pi não tem TPM, então o sistema sobe sem cifragem e um
volume LUKS é destrancado à mão a cada boot. O `data-root` do Docker vive dentro
dele, e um manifesto (`storage.map`) troca cada caminho sensível por symlink para o
volume cifrado — assim os arquivos de compose não precisam saber de nada disso. Os
scripts de subida são fail-closed: recusam iniciar se o volume não estiver montado.

**Segredo não entra no git.** Cada serviço versiona um `.env.example`; o `.env` real
é montado a partir do Vaultwarden por um comando só. O cofre é a fonte, e o
repositório pode ser público sem revisão linha a linha.

## Estado atual, sem maquiagem

**Backup está pela metade.** Só o Nextcloud tem backup automatizado e agendado. O
resto está documentado serviço por serviço, com o método certo para cada um — banco
vivo sai pela ferramenta nativa, porque copiar o arquivo a quente pega uma transação
pela metade e nasce corrompido —, mas ainda roda à mão. Enquanto for manual, não é
backup: é intenção.

**Não há CI.** Rodar o runner do Forgejo exigiria montar o `docker.sock` dentro de um
container, o que na prática é dar root no host para o CI. Preferi validar os compose
à mão a abrir esse buraco na máquina que guarda tudo.

**A senha do repositório de backup não fica no Vaultwarden.** A chave que restaura o
cofre não pode depender do cofre. Essa mora em papel e em outro dispositivo.

## De onde veio

O plano inicial está em
[Criando minha infraestrutura digital](/blog/criando-minha-infraestrutura-digital/),
escrito quando isso ainda era desenho: dois NVMe, dois SSDs e separação de dados por
domínio. O que foi ao ar é mais modesto no hardware — uma Pi e um SSD — mas manteve a
ideia que importava, a de separar dado por função em vez de jogar tudo num disco só.
