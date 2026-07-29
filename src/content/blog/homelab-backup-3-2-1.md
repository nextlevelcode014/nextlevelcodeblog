---
title: 'Backup 3-2-1 no homelab sem gastar com nuvem'
description: 'Como montar uma estratégia de backup que sobrevive a disco queimado, ransomware e incêndio — usando hardware que você já tem.'
pubDate: 2026-06-18
tags: ['homelab', 'linux', 'backup']
---

Todo mundo sabe a regra: **três cópias, dois meios diferentes, uma fora de casa**. O
que quase ninguém tem é a regra funcionando de verdade. Um HD externo na gaveta que
você conecta "de vez em quando" não é backup — é esperança.

Este é o arranjo que eu uso, e o raciocínio por trás de cada peça.

## Por que 3-2-1 e não "só um HD externo"

Cada número da regra existe para matar uma classe específica de desastre:

- **3 cópias** cobrem falha de mídia. Discos morrem, e morrem sem avisar.
- **2 meios** cobrem falha sistêmica. Se as três cópias estão em HDs do mesmo lote,
  elas podem falhar pelo mesmo defeito de fábrica.
- **1 fora do local** cobre desastre físico. Incêndio, enchente e roubo não fazem
  distinção entre o original e a cópia que está na prateleira ao lado.

Falta uma quarta ameaça que a regra clássica não cobre: **ransomware**. Backup que o
sistema infectado consegue escrever é backup que o ransomware criptografa junto. Por
isso a cópia externa precisa ser *imutável* ou pelo menos offline.

## O arranjo

```bash
# Cópia 1 — o próprio servidor, snapshots ZFS a cada hora
zfs set com.sun:auto-snapshot=true tank/dados

# Cópia 2 — segundo pool, disco de fabricante diferente
zfs send -I tank/dados@ontem tank/dados@agora | zfs recv backup/dados

# Cópia 3 — fora de casa, criptografada antes de sair da máquina
restic -r sftp:offsite:/backups backup /tank/dados
```

O detalhe que importa: `restic` criptografa **no cliente**. Quem hospeda o destino
nunca vê o conteúdo. Isso torna aceitável usar a máquina de um amigo, um VPS barato ou
até armazenamento de terceiros sem entregar seus dados.

## Testar a restauração, não o backup

Backup não testado é fé, não engenharia. Uma vez por mês:

```bash
restic -r sftp:offsite:/backups restore latest --target /tmp/teste-restore
diff -r /tank/dados/documentos /tmp/teste-restore/tank/dados/documentos
```

Se o `diff` sai limpo, você tem backup. Se você nunca rodou esse comando, você tem uma
pasta grande em algum lugar.

## O erro que quase me custou tudo

Por meses meu script de backup rodava, terminava com código 0 e não copiava nada — um
caminho tinha mudado e o `rsync` estava sincronizando um diretório vazio para outro
diretório vazio, com sucesso perfeito.

A lição não é "confira seus caminhos". É que **sucesso silencioso é um modo de falha**.
Hoje todo job de backup meu termina verificando que o destino cresceu ou que o número
de arquivos bate. Um job que não sabe dizer *quanto* fez não pode dizer que deu certo.
