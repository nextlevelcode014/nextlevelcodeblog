---
title: 'Dotfiles reproduzíveis'
description: 'Uma máquina Arch com Hyprland montada do zero por script — mesmo ambiente em qualquer hardware, em minutos.'
order: 3
year: '2025 — hoje'
status: 'ativo'
tags: ['linux', 'automacao', 'bash']
---

Configurar uma máquina nova costumava me custar um fim de semana. Hoje custa um comando
e um café.

## A ideia

Todo estado da minha máquina que eu me importo em preservar vive em um repositório
versionado: configuração do Hyprland, do terminal, do editor, do shell, e a lista de
pacotes instalados. Um script lê isso e reconstrói o ambiente.

## Por que não copiar a pasta home inteira

Porque o `$HOME` acumula lixo: cache, credencial, estado de aplicativo que não faz
sentido em outra máquina. Copiar tudo carrega o entulho junto — e às vezes carrega um
segredo para dentro do repositório.

O critério é: **o arquivo descreve como eu quero que a máquina se comporte?** Se sim,
vai versionado. Se ele só registra o que aconteceu, fica de fora.

## Segredos

Chaves e tokens ficam em um arquivo criptografado com `age`, cuja chave privada mora em
uma YubiKey. O repositório pode ser público sem risco: sem o hardware, o conteúdo
criptografado não serve para nada.

## O ganho real

Não é a velocidade de instalar. É **poder quebrar a máquina sem medo**. Quando
reconstruir custa vinte minutos, experimentar deixa de ser arriscado — e é
experimentando que se aprende.
