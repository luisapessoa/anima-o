# Landing page — "E aí, Claude?" (Woou Aí)

Landing page de venda do manual digital **E aí, Claude?**, da Woou Aí.
Design aprovado em 13/11/2026. Falta só ligar os links reais e publicar.

## O que tem nesta pasta

| Arquivo | Para que serve |
|---|---|
| `index.html` | **A landing page.** Arquivo único e autossuficiente: HTML, CSS, JavaScript, fontes e logo estão dentro dele. Não depende de internet nem de outros arquivos. |
| `previa-dispositivos.html` | Apresentação do protótipo: mostra a página lado a lado em desktop (1440×900), tablet (820×1180) e celular (390×844). Serve só para mostrar; não é para publicar. |
| `assets/logo-woou-ai.png` | Logo usado na página (fundo transparente), caso precise dele separado. |
| `LEIA-ME.md` | Este arquivo. |

Para ver, basta abrir `index.html` no navegador.

---

## O que falta fazer (pendências)

Os pontos pendentes estão marcados no `index.html` com o comentário `<!-- PENDENTE: ... -->`. É só procurar por **PENDENTE**.

1. **Checkout**: o botão "QUERO ADQUIRIR O E AÍ, CLAUDE?", no card de preço da seção 07 · Oferta, está com `href="#"`. Troque pelo link do checkout.
2. **Rodapé**: os links **Contato**, **Política de Privacidade** e **Termos de Uso** estão com `href="#"`. O link do Instagram já está certo: https://www.instagram.com/woou_ai/.
3. **Botões internos**: os outros botões ("QUERO CONHECER O MANUAL" e o "E aí, bora?" final) levam até a seção de oferta (`#oferta`). Isso é proposital, não precisa mudar.
4. **Antes de publicar** (sugestões):
   - revisar o `<title>` (já preenchido) e adicionar `<meta name="description">` para SEO;
   - adicionar favicon e imagem de compartilhamento (Open Graph);
   - incluir os scripts de rastreamento (pixel, GA/GTM), se a empresa usar.

---

## Estrutura da página

As seções estão separadas por comentários `<!-- =================== NN · NOME =================== -->` no HTML.

| Nº | Seção | id | Observação |
|---|---|---|---|
| — | Menu | `#nav` | Menu em pílula centralizado. No tablet e no celular vira menu "hambúrguer". |
| 01 | Capa | `#top` | Barra de prompt com o texto "E aí, Claude," digitando pedidos em sequência, mais selos flutuantes. |
| 02 | Identificação | `#ident` | **Transição animada** (ver abaixo). |
| 03 | Possibilidades | `#possibilidades` | 3 cards. No desktop, o texto sobe no hover. No celular e em telas de toque, o texto aparece quando o card passa pelo meio da tela. |
| 04 | O manual | `#manual` | 7 módulos em linhas numeradas. |
| 05 | Quem somos | `#quem-somos` | Faixa de tags em loop, mais a apresentação da Woou Aí. |
| 06 | Para quem é | `#para-quem` | Texto à esquerda e tópicos com ícones à direita. |
| 07 | Oferta | `#oferta` | De R$ 97,90 por **R$ 67,90**, pagamento único. **Contém o link do checkout.** |
| 08 | Perguntas frequentes | `#faq` | Usa `<details>` nativo, sem JavaScript. |
| — | CTA final | — | "E aí, bora?", leva até `#oferta`. |
| — | Rodapé | — | **Contém os links pendentes.** |

### Animação da capa para a dobra 2
- A capa (`header.hero`) e a dobra 2 (`section.ident8`) ficam dentro de `div#flow`.
- Elas compartilham um fundo fixo, o `.flowbg`, que usa `position: sticky`.
- Ao rolar:
  - o conteúdo da capa some;
  - uma luz neon sobe de baixo até tomar a tela;
  - as palavras da dobra 2 aparecem uma a uma.
- O controle é feito pelo script comentado `/* capa → dobra 2 ... */`, no final do arquivo.
- **Tablet:** a animação usa uma versão mais leve da luz neon (classe `.fast`, regra `v28` no CSS), em que um círculo pequeno é ampliado com `transform` em vez de redesenhar a máscara a cada quadro. Também precisa de menos rolagem para o texto aparecer. Desktop e celular não mudam.
- **Cuidado:** `.flow` precisa manter `overflow: clip`. Sem isso, o fundo neon "vaza" para a seção do manual.
- Quem configura o sistema para reduzir animações (`prefers-reduced-motion`) vê tudo estático, já com os textos visíveis.

---

## Identidade visual

**Cores** (usar só estas):

| Cor | Hex | Uso |
|---|---|---|
| Verde | `#006647` | Cor principal, textos e botões |
| Neon | `#bcfe88` | Destaques e botões (vem do logo) |
| Bege | `#f6f7ed` | Fundo claro (**não usar branco**) |
| Verde-água | `#b4e6e1` | Apoio |
| Ciano | `#09dde0` | Só em detalhes, como nos degradês dos cards. Nunca em botões nem em hover. |

**Fonte:** General Sans (Regular, Medium, Semibold e Bold). A fonte já está embutida no arquivo em base64, então não precisa instalar nem carregar de fora.

**Regras que o design segue:**
- botões sem contorno e números sem contorno;
- texto sem cinza;
- no máximo 2 cores por dobra;
- a seta dos botões gira no hover para indicar o destino;
- o hover nunca fica da mesma cor do fundo.

**Responsivo** (pontos de quebra principais):
- celular: até 640px;
- tablet: de 641px a 1180px;
- desktop: acima de 1180px.

---

## Notas técnicas para quem for finalizar

- **Arquivo único:** fontes e logo estão em base64. Por isso o arquivo é grande (cerca de 490 KB).
  - Se quiser, dá para extrair para arquivos separados (`/fonts`, `/img`) e referenciar por URL. Melhora o cache.
- **CSS em camadas:**
  - O CSS foi construído em rodadas de ajuste, marcadas com comentários `/* ================= vNN ================= */`.
  - As regras mais abaixo sobrescrevem as de cima.
  - Ao editar, procure a regra **mais abaixo** que afeta o elemento.
  - Se quiser consolidar o CSS, compare visualmente antes e depois nos 3 tamanhos, porque muitas regras dependem dessa ordem.
- **Sem bibliotecas externas:** nada de framework, CDN ou build. É só HTML, CSS e JavaScript puros.
- **Marca:** a página não usa o logo do Claude/Anthropic de propósito, por ser marca registrada.
  - O rodapé traz o aviso: "Material educacional independente, sem vínculo oficial com a Anthropic…"
  - Mantenha esse aviso.
- **Textos:** seguem o briefing aprovado. Não adicione textos fora do briefing sem aprovação.
