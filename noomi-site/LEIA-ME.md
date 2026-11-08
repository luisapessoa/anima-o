# Noomi: site institucional (entrega)

Site de uma página, em HTML + CSS + JavaScript puro. Não usa framework, build nem bibliotecas externas: basta subir a pasta `noomi-site/` para qualquer hospedagem (servidor da empresa, Netlify, Vercel, GitHub Pages, Hostinger etc.).

## Estrutura

```
noomi-site/
├── index.html            ← página inteira (estrutura, estilos e scripts)
└── assets/
    ├── fonts/            ← fonte Outfit (Regular, Medium, SemiBold, Bold), local
    ├── img/              ← hero.jpg (capa), banner.jpg (faixa do carro azul),
    │                        how.jpg (Como funciona), cta.jpg (chamada final),
    │                        selo.webp (selo "Não atendemos app de mobilidade")
    ├── cars/             ← PNGs dos planos (webp, canvas padronizado 1000×520)
    ├── logos-w/          ← logos das locadoras em branco
    ├── noomi-white.png   ← logo Noomi
    ├── oo-blur.webp      ← símbolo "oo" desfocado (Quem somos)
    ├── grain-w.png, noise.png ← texturas
```

Para testar localmente, abra `index.html` no navegador.

## Responsividade (já pronta, não precisa refazer)

Tudo fica dentro do próprio `index.html`, em media queries:

| Faixa de largura | Dispositivo |
|---|---|
| ≥ 1280px | Desktop / notebook |
| 1025px – 1279px | Notebook pequeno / tablet deitado (capa e "Por que escolher" com ajustes próprios) |
| 721px – 1024px | Tablet em pé (bloco `/* ===== TABLET ===== */`) |
| ≤ 720px | Celular (bloco `/* ===== CELULAR ===== */`) |

Também acompanha `noomi-previa-dispositivos.html`, uma prévia interativa com botões para Desktop, Notebook, Tablet, Tablet deitado e Celular. Ela serve só para revisão e não deve ser publicada.

## O que precisa ser preenchido antes de publicar

1. **Link do formulário**: no fim do `index.html`:
   ```js
   const FORM_URL = "#";
   ```
   Troque `"#"` pela URL do formulário. Só o botão **"Solicite sua cotação"** (atributo `data-form`) usa esse link e abre em nova aba. Todos os botões **"Fale com um consultor"** e os cards de planos rolam para a seção `#como-funciona`, de propósito.

2. **Termos de Uso e Políticas de Privacidade**: no rodapé (`<footer class="ft">`), os dois links estão com `href="#"`. Basta trocar pelas URLs das páginas.

3. **Favicon e imagem de compartilhamento**: ainda não existem. Sugestão: adicionar no `<head>`:
   ```html
   <link rel="icon" href="assets/favicon.png">
   <meta property="og:image" content="https://SEU-DOMINIO/assets/og.jpg">
   ```

4. **Analytics / pixel** (se houver): colar antes de `</head>`.

## Outros pontos editáveis

- **Instagram**: link no rodapé (`https://www.instagram.com/noomioficial/`).
- **CNPJ**: no rodapé.
- **Título e descrição para o Google**: `<title>` e `<meta name="description">` no topo.
- **Cores**: variáveis no início do CSS (`:root`): `--ink #181818`, `--white #FFFFFF`, `--beige #EBEBEB`, `--cyan #09DDE0`.
- **Textos do FAQ**: blocos `<details>`, na seção FAQ.
- **Depoimentos**: cards `.tc` na seção "Quem assina, recomenda".
- **Novo plano (7ª categoria)**: duplique um `<a class="card">` dentro de `.plans` e use uma imagem nova em `assets/cars/` no mesmo formato (1000×520, fundo transparente).

## Seções / âncoras do menu

`#topo` (capa) · `#modelos` (planos) · `#saiba-mais` (por que escolher) · `#frota` (locadoras) · `#como-funciona` (passo a passo) · `#quem-somos` · `#faq`

## Observações de comportamento

- As animações respeitam `prefers-reduced-motion`.
- No celular, os bullets da capa passam sozinhos até a pessoa tocar.
- A frase "Você aproveita o carro…" é "digitada" quando a faixa entra na tela.
- O rastro ciano em "Como funciona" acompanha as etapas 01→05.
