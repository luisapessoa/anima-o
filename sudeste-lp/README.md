# Sudeste Assinaturas: landing page

Landing page estática de carro 0km por assinatura da Sudeste (concessionária Volkswagen em Juiz de Fora). É uma réplica refeita do site do GreatPages (`noomioficial-com-br.pages.net.br/sudeste`), com ajustes de layout, animações e versões para celular e tablet.

Não tem build nem dependências: é um `index.html` com o CSS e o JS dentro dele, mais a pasta `img/`. Para publicar, é só subir a pasta inteira para qualquer hospedagem estática (Netlify, Vercel, GitHub Pages, Hostinger, cPanel etc.).

## Estrutura

```
index.html      página completa (CSS e JS inline, fonte DM Sans embutida em base64)
img/            imagens usadas pela página (24 arquivos + favicon e imagem de compartilhamento)
README.md       este arquivo
```

## Identidade

- Fonte: DM Sans Regular (400) e Bold (700), embutida no próprio HTML (não depende do Google Fonts).
- Cores: `#034845` (verde-escuro), `#00d1b2` (verde-água), `#c6f6d6`, `#f2ff46` (amarelo), `#efefef`, `#ffffff`. Estão como variáveis no topo do CSS (`:root`).
- Botões ao passar o mouse: amarelo vira `#00d1b2`; verde-água vira `#034845` com texto branco.

## Seções (as "dobras")

1. Capa (`.hero`) com 5 benefícios
2. Nossos diferenciais (`.diferenciais`)
3. Planos: Hatch, Sedan, SUV, Utilitário, 4x4 (`.planos`)
4. Por que escolher um carro por assinatura (`.porque`)
5. A estrutura Sudeste (`.estrutura`)
6. Passo a passo (`.passos`)
7. Solicite uma cotação (`#cotacao`)
8. Quem somos (`.quem`)
9. FAQ (`#faq`)
10. Rodapé

## Pontos de quebra (responsivo)

- Desktop: acima de 1060px. As quebras de linha dos textos são fixas (`<br class="d">`) e copiam o site original.
- Tablet: 768px a 1060px. Tem regras próprias, aprovadas uma a uma; 768px a 900px usa a capa no formato vertical.
- Celular: até 767px.
- Classes de quebra: `br.d` aparece só no desktop, `br.t` só no tablet, `br.m` só no celular.

## Animações

- Entrada da capa em sequência; seções aparecem ao rolar (classe `.rv`, controlada pelo script no fim do HTML).
- Selos "Não atendemos app de mobilidade" balançam; cartões e ícones reagem ao mouse; o "31" conta de 0 a 31.
- Tudo desliga sozinho para quem ativou "reduzir movimento" no sistema.

## Pendências antes de publicar

1. **Links dos botões (obrigatório).** Os 11 botões ("Solicitar cotação!", "Fale com um consultor!", "Assinar!") apontam para `#cotacao`, ou seja, só rolam até a seção de cotação. O botão de dentro da própria seção de cotação aponta para ela mesma e não faz nada. Falta definir o destino: link do WhatsApp (`https://wa.me/55DDDNUMERO?text=...`) ou um formulário.
2. **Formulário.** O texto da página fala em "Preencha o formulário", mas ainda não existe formulário na página. Ou se cria um (e define para onde os dados vão: e-mail, CRM, planilha), ou se ajusta o texto para o WhatsApp.
3. **Endereço do site.** Trocar `URL_DO_SITE` nas tags `og:image` e `og:url` (no `<head>`) pelo domínio final, para a prévia do link aparecer certa no WhatsApp e nas redes.
4. **Pixel / Google Tag Manager / Analytics.** Se o site do GreatPages tinha rastreamento, colar os códigos onde está o comentário `<!-- Pixel / Google Tag Manager: colar aqui -->`.
5. **Política de privacidade / LGPD.** Se houver formulário ou pixel, normalmente é preciso link para política de privacidade e aviso de cookies.
6. **Textos.** Conferir "Sudeste Assinatura" (sem "s") em duas respostas do FAQ: foi mantido como veio no texto enviado.

## O que já foi conferido

- Nenhuma imagem sem texto alternativo; nenhum arquivo referenciado faltando; nenhuma dependência externa.
- HTML com todas as tags fechadas e sem IDs duplicados.
- Sem rolagem horizontal em 390px, 820px, 1024px e 1600px.
- Imagens abaixo da capa com carregamento preguiçoso (`loading="lazy"`); as duas capas são pré-carregadas.
