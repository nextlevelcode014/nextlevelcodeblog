---
title: 'Senhas e 2FA: o mínimo que resolve 95% dos ataques'
description: 'Sem paranoia e sem teatro de segurança — as quatro mudanças que realmente derrubam o risco de ter uma conta invadida.'
pubDate: 2026-05-02
tags: ['seguranca', 'privacidade']
---

A maior parte das contas invadidas não cai por um ataque sofisticado. Cai porque a
senha vazou em um site qualquer e era a mesma de todos os outros. O conserto é chato,
não é difícil.

## 1. Um gerenciador de senhas, e só ele sabe

O ponto de um gerenciador não é "guardar senhas". É permitir que cada serviço tenha uma
senha **diferente e longa**, o que transforma um vazamento em um problema local em vez
de um problema geral.

Recomendo [KeePassXC](https://keepassxc.org/) (arquivo local, você controla onde ele
mora e como sincroniza) ou [Bitwarden](https://bitwarden.com/) auto-hospedado, se
sincronização automática pesar mais que soberania total no seu caso.

A senha-mestra é a única que você memoriza. Ela deve ser uma **frase**, não uma palavra
com símbolos:

```text
Ruim:  Tr0v@d0r!23        (curta, previsível, difícil de lembrar)
Boa:   cavalo bateria grampo correto   (longa, aleatória, memorizável)
```

Comprimento vence complexidade. Sempre.

## 2. 2FA — mas não por SMS

SMS é o pior segundo fator disponível, porque a operadora pode ser convencida a portar
seu número para o chip de outra pessoa. Isso se chama *SIM swap* e acontece no Brasil
com frequência desconfortável.

Em ordem de preferência:

1. **Chave física** (YubiKey, Nitrokey) — resiste a phishing, porque a chave verifica
   o domínio antes de responder.
2. **App TOTP** (Aegis, KeePassXC) — bom, mas um site falso convincente ainda consegue
   te fazer digitar o código.
3. **SMS** — melhor que nada, pior que tudo acima.

## 3. E-mail é a chave-mestra

Quem controla seu e-mail redefine a senha de todo o resto. Então o e-mail principal
merece a senha mais forte, o 2FA mais robusto e, idealmente, não ser o mesmo endereço
que você espalha em cadastro de loja.

## 4. Saiba o que já vazou

Consulte [Have I Been Pwned](https://haveibeenpwned.com/) com seus endereços. Não é
paranoia: é inventário. Você não pode trocar a senha de um vazamento que não sabe que
aconteceu.

---

Nada aqui é avançado. É higiene. E higiene, feita de forma consistente, para mais
ataque do que qualquer ferramenta cara instalada depois do estrago.
