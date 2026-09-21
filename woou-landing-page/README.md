# Woou — Landing Page "Operação 360º" (pré-visualização)

Recriação em HTML/CSS/JS estático da LP de captação B2B da Woou (design
aprovado em Claude Design, ver handoff original em
`design_handoff_woou_lp/`), pronta para pré-visualização.

Abra `index.html` diretamente no navegador — não há build, não há
dependências externas (fontes e imagens estão embutidas no próprio
arquivo).

## O que já está pronto
- Todas as 9 dobras da LP, cópia e tokens de design fiéis ao handoff
  (cores, tipografia General Sans, espaçamentos).
- Animações: reveal on scroll, frase digitada no herói, ícones
  flutuantes, carrossel da "Operação 360º", trilha animada do "Como
  Funciona", sublinhados animados, acordeão de FAQ.
- Responsivo (breakpoints em 700px e 400px, replicando o mobile
  aprovado).
- Respeita `prefers-reduced-motion`.

## O que falta antes de publicar de verdade
1. **Destino do formulário.** Hoje o envio é só uma simulação local
   (mostra a mensagem de sucesso, não envia para lugar nenhum) — dá
   para demonstrar o funcionamento, mas precisa apontar para
   e-mail/CRM/webhook real antes de ir ao ar. O ponto exato para
   trocar isso está marcado com um comentário `TODO(integração)` no
   `<script>` no final do `index.html` (procure por `data-form`).
2. **Remover a faixa de pré-visualização** no topo da página (`<!--
   Pré-visualização: remover esta faixa antes de publicar no domínio
   final. -->`, logo no início do `<body>`).
3. **Domínio + HTTPS.** O arquivo é 100% estático (HTML/CSS/JS num
   único arquivo, sem build, sem dependências externas) — sobe em
   qualquer hospedagem estática (Vercel, Netlify, S3 + CloudFront,
   etc.) ou atrás de um servidor simples.
4. Analytics/pixel (GA4, Meta) e evento de conversão no envio do
   formulário.
5. Aviso de privacidade/consentimento (LGPD) no formulário.
6. Meta description, Open Graph/Twitter card, favicon definitivo.
