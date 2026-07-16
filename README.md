# noomi — Oferta Relâmpago (animação)

Versão animada da arte **"Oferta Relâmpago — Peugeot 2008 Allure"** da noomi,
recomposta para o formato **1920×1080 (paisagem)**.

Basta abrir `index.html` no navegador. A animação roda em loop.

## O que foi mantido da arte original
- **Fonte:** Outfit (carregada via Google Fonts).
- **Cores:** azul noomi (`#1b3ad1`), azul de destaque (`#2a55f0`), vermelho dos selos
  (`#c31a1a`), preto do texto (`#14161c`) e o fundo cinza com grão + vinheta.
- **Todos os elementos:** logo noomi, "OFERTA RELÂMPAGO", carro, selo "NÃO ATENDEMOS
  APP DE MOBILIDADE", tag "CARRO POR ASSINATURA", "Peugeot 2008 Allure",
  "Últimas unidades", "A partir de 2.685,00/mês", botão "Oferta para CNPJ" e o
  aviso "*Sujeito à análise de crédito*".

## Sequência da animação
1. Logo noomi desce e aparece.
2. "OFERTA" e "RELÂMPAGO" entram deslizando.
3. O carro entra da lateral e ganha uma leve flutuação contínua.
4. O selo vermelho "carimba" na tela girando.
5. Tag e card sobem em sequência.
6. O selo "Últimas unidades" pulsa e o botão pulsa com brilho passando (call-to-action).
7. Um **flash de relâmpago** cobre a cena periodicamente (tema "Relâmpago").

Respeita `prefers-reduced-motion` (desativa movimento/flash para quem prefere).

## Usar a FOTO real do carro (opcional, recomendado)
A ilustração do SUV é apenas um *fallback*. Para usar a foto real do Peugeot 2008:

1. Salve a foto (fundo transparente, PNG) em `assets/car.png`.
2. Recarregue a página — a foto substitui a ilustração automaticamente.

## Escala responsiva
O palco tem exatamente 1920×1080. Ele é escalado proporcionalmente para caber em
qualquer tela sem distorção. Para exportar em vídeo, grave a página em 1920×1080.
